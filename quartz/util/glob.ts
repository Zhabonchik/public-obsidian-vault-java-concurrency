import fs from "fs"
import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

/**
 * Resolve a path, following Junctions/symlinks to their real destination.
 * On Windows, globby doesn't follow Junctions by default even with followSymbolicLinks,
 * so we resolve the real path before passing it to globby.
 *
 * Junctions (directory symlinks) are handled correctly by Node.js's fs.realpathSync
 * on Windows, which resolves them to the actual target path.
 */
function resolveCwd(cwd: string): string {
  try {
    // fs.realpathSync resolves symlinks AND Junctions on Windows.
    // If cwd is already a real directory, it returns the same path.
    return fs.realpathSync(cwd)
  } catch {
    // If realpathSync fails (e.g. path doesn't exist), return original
    return cwd
  }
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
): Promise<FilePath[]> {
  const resolvedCwd = resolveCwd(cwd)
  const fps = (
    await globby(pattern, {
      cwd: resolvedCwd,
      ignore: ignorePatterns,
      gitignore: true,
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
