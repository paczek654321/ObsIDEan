import { Plugin, Notice, TFile } from "obsidian";
import { CodeView, CODE_VIEW_TYPE } from "view";
import { createLSPPlugin } from "lsp";
import { cpp } from "@codemirror/lang-cpp"
import { python } from "@codemirror/lang-python"
import { Extension } from "@codemirror/state";
const { spawn } = window.require("child_process") as typeof import("child_process");

export default class ObsIDEanPlugin extends Plugin
{
	language_servers: ReturnType<typeof spawn>[] = []

	async onload() { this.app.workspace.onLayoutReady(this.startup) }

	onunload = () =>
	{
		this.language_servers.forEach(server => {
			server.kill('SIGKILL')
		});
	}

	startup = () =>
	{
		this.registerEvent(this.app.workspace.on("quit", this.onunload))
		
		this.register_language("cpp", ["cpp", "hpp"], "clangd", [cpp()], (f) => f.name === "compile_commands.json")
		this.register_language("python", ["py"], "pylsp", [python()], (f) => f.extension === "py")
	}

	register_language(name: string, files: string[], lsp_server: string, extensions: Extension[], detect: (f: TFile) => boolean)
	{
		if (this.app.vault.getFiles().find(detect) === undefined) { return }

		let server = spawn(lsp_server)
		if (server.pid === undefined)
		{
			new Notice(`Missing LSP server binary for ${name} (${lsp_server})`)
			return
		}
		else
		{
			new Notice(`Enabled ${name} support`)
		}
		this.language_servers.push(server)

		this.registerView(CODE_VIEW_TYPE+`_${name}`, (leaf) => new CodeView(leaf, createLSPPlugin(server.stdin, server.stdout), name, extensions))
		this.registerExtensions(files, CODE_VIEW_TYPE+`_${name}`)
	}
}