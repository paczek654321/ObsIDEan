import { EditorState, Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import {indentWithTab } from "@codemirror/commands"
import { indentUnit, HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { tags } from "@lezer/highlight"


export function indentation(character: string, size: number): Extension[]
{
	return [
		keymap.of([indentWithTab as any]),
		EditorState.tabSize.of(size),
		indentUnit.of(character),
	]
}

export function style(dark: boolean): Extension[]
{
	return [
		EditorView.editorAttributes.of({ class: "markdown-source-view mod-cm6 cm-s-obsidian" }),
		syntaxHighlighting(HighlightStyle.define(
		[
			{
				tag: tags.keyword,
				color: "var(--color-purple)"
			},
			{
				tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
				color: "var(--color-pink)"
			},
			{
				tag: [tags.literal, tags.inserted],
				color: "var(--color-green)"
			},
			{
				tag: [tags.string, tags.deleted],
				color: "var(--color-yellow)"
			},
			{
				tag: [tags.regexp, tags.escape, tags.special(tags.string)],
				color: "var(--color-orange)"
			},
			{
				tag: tags.definition(tags.variableName),
				color: "var(--color-blue)"
			},
			{
				tag: [tags.typeName, tags.namespace],
				color: "var(--color-cyan)"
			},
			{
				tag: [tags.special(tags.variableName), tags.macroName, tags.processingInstruction],
				color: "var(--color-pink)"
			},
			{
				tag: tags.comment,
				color: "var(--text-faint)"
			},
			{
				tag: tags.propertyName,
				color: "var(--text-muted)"
			},
			{
				tag: [tags.brace, tags.bracket, tags.squareBracket],
				color: "var(--color-pink)"
			}
		])),
		EditorView.theme(
		{
			"*":
			{
				fontFamily: "var(--font-monospace)"
			},
			".cm-selectionBackground":
			{
				background: "var(--text-selection) !Important"
			},
			".cm-activeLine":
			{
				background: "transparent"
			},
			".cm-activeLine::before":
			{
				position: "absolute",
				width: "100%",
				height: "100%",
				content: '""',
				background: "var(--background-primary-alt)",
				zIndex: "-2"
			},
			".cm-button":
			{
				background: "var(--background-primary-alt)",
				border: "none",
				fontFamily: "--font-text-theme"
			},
			'input[type="checkbox"]':
			{
				verticalAlign: "middle"
			}
		},
		{ dark: dark })
	]
}