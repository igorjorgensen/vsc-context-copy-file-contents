import { spawn } from "child_process";

export type CopyToClipboardProps = {
  content?: string;
};

export async function copyToClipboard({ content }: CopyToClipboardProps) {
  if (!content) {
    throw new Error("No content provided for copying to clipboard");
  }

  try {
    const platform = process.platform;
    const copyCommand =
      platform === "win32"
        ? "clip"
        : platform === "darwin"
          ? "pbcopy"
          : "xclip -selection clipboard";
    const proc = spawn(copyCommand, { shell: true });

    proc.stdin.write(content);
    proc.stdin.end();
  } catch (error: any) {
    throw new Error(`Error copying to clipboard: ${error.message}`);
  }
}
