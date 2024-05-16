export function removeCommentsFromCode(code: string): string {
  // Remove single-line comments
  code = code.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, "");

  return code;
}
