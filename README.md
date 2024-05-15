# Context Copy File Contents

## Description

The **Context Copy File Contents** extension for Visual Studio Code allows you to right-click a folder and copy the contents of all `.ts`, `.js`, `.jsx`, and `.tsx` files within that folder into the clipboard. The content is prefixed with the relative file path from the selected folder.

## Features

- Right-click on a folder in the VS Code Explorer and select "Copy File Contents To Clipboard" to copy the contents of all relevant files in the folder to the clipboard.
- Configurable file extensions to specify which file types to include when copying content.

## Installation

1. Download and install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).
2. Alternatively, you can clone the repository and build the extension yourself.

## Configuration

You can configure the file extensions to include when copying folder contents. The default extensions are `.js`, `.ts`, `.jsx`, and `.tsx`.

To change the configuration:

1. Open VS Code settings (`Ctrl + ,` or `Cmd + ,`).
2. Search for `Copy Folder Content`.
3. Modify the `File Extensions` setting to include the extensions you want.

## Usage

1. Right-click on a folder in the VS Code Explorer.
2. Select `Copy File Contents To Clipboard`.
3. The content of all files with the specified extensions in the selected folder will be copied to the clipboard, prefixed with their relative paths.

## Example

Given a folder structure:

```
src/
├── john/
│ └── peter.ts
└── jane/
└── doe.js
```

If you right-click on the `src` folder and select `Copy File Contents To Clipboard`, the clipboard content will be:

```
// john/peter.ts
// [Content of peter.ts]

// jane/doe.js
// [Content of doe.js]
```

## Development

To build and install the extension locally:

1. Clone the repository:

   ```sh
   git clone https://github.com/igorjorgensen/vsc-context-copy-file-contents.git
   cd vsc-context-copy-file-contents
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Compile the extension:

   ```sh
   npm run compile
   ```

4. Package the extension:

   ```sh
   npm run package
   ```

5. Install the extension:
   ```sh
   code --install-extension ./<your-extension-name>.vsix
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Repository

[GitHub Repository](https://github.com/igorjorgensen/vsc-context-copy-file-contents)
