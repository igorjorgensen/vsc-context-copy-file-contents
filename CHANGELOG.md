# Changelog

## [1.1.0] - 2024-05-16

### Added

- New configuration `copyFolderContent.exclude` to exclude files and folders based on specified glob patterns.
- New configuration `copyFolderContent.removeComments` to remove comments from the copied content.
- New configuration `copyFolderContent.gitignore` to respect .gitignore rules when copying folder contents.
- New configuration `copyFolderContent.includeMetadata` to include file metadata (size, last modified date) in the header.
- New functionality to wrap file content in triple backticks for syntax highlighting.
- Utilized `extensionToSyntax` to determine the appropriate syntax for each file extension.
- Supported a wide range of file extensions and their corresponding syntax highlighting.
- Updated error handling and content trimming when content exceeds the maximum size.
- Respected `.gitignore` rules when collecting content from folders.

### Changed

- Refactored code to follow the single function per file rule, with each function taking a single object argument and using type definitions for the argument objects.
- Updated configuration options and default values for better flexibility and control.
- Improved performance by reading files in parallel using `Promise.all`.

## [1.0.0] - 2024-05-16

### Added

- Initial release of the Context Copy File Contents extension.
- Basic functionality to copy the contents of files within a folder or selected files to the clipboard.
- Configuration options for specifying file extensions and maximum content size.
