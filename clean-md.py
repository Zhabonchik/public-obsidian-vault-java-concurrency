import os
import re

def clean_markdown_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    original_lines = lines[:]

    # Step 1: Remove heading if it starts with '# '
    if lines and lines[0].lstrip().startswith("# "):
        print(f"[{filepath}] ✓ Removing heading: {repr(lines[0])}")
        lines.pop(0)

    # Step 2: Skip any blank lines at the top
    while lines and lines[0].strip() == "":
        lines.pop(0)

    # Step 3: Remove the next line if it’s a date
    if lines and re.fullmatch(r'\d{2}-\d{2}-\d{4}', lines[0].strip()):
        print(f"[{filepath}] ✓ Removing date: {repr(lines[0])}")
        lines.pop(0)

    # Write back only if changed
    if lines != original_lines:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"[{filepath}] ✔ Cleaned.\n")
    else:
        print(f"[{filepath}] ✖ No changes made.\n")

def process_markdown_files(root_folder):
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith(".md"):
                filepath = os.path.join(dirpath, filename)
                clean_markdown_file(filepath)

# 👇 Replace with your actual path
root_folder = "content"
process_markdown_files(root_folder)
