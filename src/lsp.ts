import { DataAdapter, FileSystemAdapter, TFile } from "obsidian"

import { JSONRPCTransform } from "ts-lsp-client/jsonRpcTransform"
import { Writable, Readable } from "stream"

import { LSPClient, languageServerExtensions } from "@codemirror/lsp-client"

import { Compartment, Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

const { pathToFileURL } = window.require("url") as typeof import("url");

function get_file_path(adapter: DataAdapter, file: TFile)
{
	if (adapter instanceof FileSystemAdapter)
	{
		return pathToFileURL(`${adapter.getBasePath()}/${file.path}`).href
	}
	return ""
}

export class LSPPlugin
{
	private client: LSPClient
	private compartment: Compartment

	constructor(client: LSPClient)
	{
		this.client = client
		this.compartment = new Compartment()
	}

	plugin(path: string): Extension
	{
		return this.client.plugin(path)
	}

	public extension(): Extension
	{
		return this.compartment.of(this.plugin(""))
	}

	public changeFile(adapter: DataAdapter, file: TFile, view: EditorView)
	{
		view.dispatch(
		{
			effects: this.compartment.reconfigure
			(
				this.client.plugin(get_file_path(adapter, file))
			)	
		})
	}
}

export function createLSPPlugin(stdin: Writable | null, stdout: Readable | null): LSPPlugin
{
	if (!(stdin && stdout)) { throw "Failed to start the LSP server" }

	const readable = JSONRPCTransform.createStream(stdout)
	
	const client = new LSPClient({ extensions: languageServerExtensions() })
	client.connect(
	{
		send: (message: string) =>
		{
			const contentLength = Buffer.from(message, 'utf-8').byteLength;
			stdin.write(`Content-Length: ${contentLength}\r\n\r\n${message}`);
		},
		subscribe: (handler: (value: string) => void) =>
		{
			readable.on("data", handler)
		},
		unsubscribe: (handler: (value: string) => void) =>
		{
			readable.off("data", handler)
		}
	})
	return new LSPPlugin(client)
}