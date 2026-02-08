# ObsIDEan
## About
ObsIDEan is an Obsidian plugin that lets you edit code.
Currently it's somewhat functional but still missing plenty both essential and QOL features.
## Usage
1. Clone the project to your Obsidian vault's plugin directory
2. Run `npm install`
3. Run `npm run dev`
4. Enable the plugin in Obsidian settings
## Currently supported
### C++
Requirements:
- clangd
### Python
Requirements:
- pylsp
- pyflakes
## To be implemented
- Automatic code fixes support
- Creating new files
- GoTo (deffinition/declaration) support
- Less clunky keybinds
- User customizatiom
- Global search/replace
- Integrated terminal
- Quick run
- ...
# Third party components
`/src/ts-lsp-client` is a seperately licensed part of https://github.com/ImperiumMaximus/ts-lsp-client
