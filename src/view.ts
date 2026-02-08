import { WorkspaceLeaf, TextFileView, TFile, ViewStateResult } from "obsidian";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { EditorState, Extension, Transaction } from "@codemirror/state";
import { basicSetup } from "@codemirror/basic-setup";
import { LSPPlugin } from "lsp";
import { indentation, style } from "extensions";
import { searchKeymap } from "@codemirror/search"
export const CODE_VIEW_TYPE = "codeview"

export class CodeView extends TextFileView {
	private editorState: EditorState
	private editorView: EditorView

	constructor(leaf: WorkspaceLeaf, private lspPlugin: LSPPlugin, public language: string, extensions: Extension[])
	{
		super(leaf)
		this.editorState = EditorState.create(
		{
			extensions:
			[
				extensions,
				basicSetup,
				keymap.of(searchKeymap),
				indentation("	", 2137),
				style(this.app.isDarkMode()),
				EditorView.updateListener.of(this.onEdit),
				this.lspPlugin.extension()
			]
		})
		this.editorView = new EditorView(
		{
			state: this.editorState,
			parent: this.contentEl
		})
  	}

	onEdit = (update: ViewUpdate) =>
	{
		if (update.docChanged) { this.requestSave() }
	}

	async setState(state: any, result: ViewStateResult): Promise<void>
	{
		await this.save(false)
		super.setState(state, result)
	}

	async onLoadFile(file: TFile): Promise<void>
	{
		this.lspPlugin.changeFile(this.app.vault.adapter, file, this.editorView)
		await super.onLoadFile(file)
	}

	getViewType(): string { return CODE_VIEW_TYPE+`_${this.language}` }
	
	getViewData(): string { return this.editorView.state.doc.toString() }
	
	setViewData(data: string, clear: boolean): void
	{
		this.editorView.dispatch({
			changes: {
				from: 0,
				to: this.editorView.state.doc.length,
				insert: data
			},
			annotations: Transaction.addToHistory.of(!clear)
		});
	}

	getDisplayText(): string
	{
		return this.file ? this.file.name : super.getDisplayText()
	}
	
	clear(): void { this.editorView.destroy() }
}
