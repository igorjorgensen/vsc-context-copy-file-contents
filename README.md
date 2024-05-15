# Context Copy File Contents

Right click a folder in the explorer and copy the content of all TypeScript and JavaScript files within that folder to the clipboard.

## Features

- Adds a context menu item to folders in the VSCode explorer.
- Copies the content of all `.ts` and `.js` files in the selected folder to the clipboard.
- Each file's content is prefixed with a comment indicating its path.

## Installation

1. **Install from VSCode Marketplace**

   - Search for `Context Copy File Contents` in the Extensions view (Ctrl+Shift+X).
   - Click Install.

2. **Build and Install from Source**
   - Clone this repository:
     'git clone https://github.com/igorjorgensen/vsc-context-copy-file-contents'
   - Navigate to the extension directory:
     'cd vsc-context-copy-file-contents'
   - Install dependencies:
     'npm install'
   - Compile the extension:
     'npm run compile'
   - Open the extension in VSCode:
     'code .'
   - Press `F5` to run the extension in a new VSCode window.

## Usage

1. Right-click on any folder in the VSCode explorer.
2. Select `Copy content to clipboard` from the context menu.
3. The content of all `.ts` and `.js` files in the selected folder will be copied to your clipboard.

## Development

### Prerequisites

- Node.js
- npm

### Setup

1. Clone the repository:
   'git clone https://github.com/igorjorgensen/vsc-context-copy-file-contents'
2. Navigate to the extension directory:
   'cd vsc-context-copy-file-contents'
3. Install dependencies:
   'npm install'

### Build

- Compile the extension:
  'npm run compile'

### Run

- Open the extension in VSCode:
  'code .'
- Press `F5` to open a new VSCode window with the extension loaded.

## Contributing

Feel free to submit issues and pull requests.

## License

MIT

## Author

Igor Jorgensen

---

### Example

Here's a quick example of what the output might look like when copying the content of files from a folder:

'
// path/to/file1.ts
console.log('File 1');

// path/to/file2.js
console.log('File 2');
'

This output will be copied to your clipboard when you use the `Copy content to clipboard` option.
