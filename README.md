<p align="center">
  <img src="./assets/readme-title.png" width="600" />
</p>

# Context Copy File Contents

## Description

The Context Copy File Contents extension allows you to copy the contents of files within a folder or selected files to the clipboard directly from the VS Code context menu. This is particularly useful for quickly sharing code snippets or combining multiple files' contents into one clipboard action.

## Features

- **Copy Folder Content**: Right-click a folder and select 'Copy File Contents To Clipboard' to copy the contents of all files within the folder that match specified glob patterns.
- **Copy Single File**: Right-click a single file and select 'Copy File Contents To Clipboard' to copy the content of the file to the clipboard.
- **Copy Multiple Selections**: Right-click multiple selected files or folders and select 'Copy File Contents To Clipboard' to copy the contents of all selected items.

## Configuration

### `copyFolderContent.include`

Specifies the glob patterns to include when copying folder contents.

Default:

```json
{
  "copyFolderContent.include": ["**/*.{js,ts,jsx,tsx}"]
}
```

### `copyFolderContent.exclude`

Specifies the glob patterns to exclude when copying folder contents.

Default:

```json
{
  "copyFolderContent.exclude": ["node_modules"]
}
```

### `copyFolderContent.maxContentSize`

Specifies the maximum content size (in bytes) to copy to the clipboard.

Default:

```json
{
  "copyFolderContent.maxContentSize": 1048576
}
```

### `copyFolderContent.removeComments`

Specifies whether to remove comments from the copied content.

Default:

```json
{
  "copyFolderContent.removeComments": false
}
```

### `copyFolderContent.gitignore`

Specifies whether to respect .gitignore rules when copying folder contents.

Default:

```json
{
  "copyFolderContent.gitignore": true
}
```

### `copyFolderContent.includeMetadata`

Specifies whether to include file metadata (size, last modified date) in the header.

Default:

```json
{
  "copyFolderContent.includeMetadata": false
}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

## Installation

1. Install the extension from the VS Code marketplace.
2. Configure the extension settings in your `settings.json` file if necessary.

## Usage

1. **Copy Folder Content**:

   - Right-click on a folder in the VS Code Explorer.
   - Select 'Copy File Contents To Clipboard'.

2. **Copy Single File**:

   - Right-click on a file in the VS Code Explorer.
   - Select 'Copy File Contents To Clipboard'.

3. **Copy Multiple Selections**:
   - Select multiple files or folders in the VS Code Explorer.
   - Right-click on one of the selected items.
   - Select 'Copy File Contents To Clipboard'.

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Please follow the code style and guidelines outlined in the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
