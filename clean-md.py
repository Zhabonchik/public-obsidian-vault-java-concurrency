import os
import re
from datetime import datetime

def convert_to_frontmatter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    original_lines = lines[:]

    # Extract title from line 0
    title = lines[0].strip().lstrip("# ").strip() if lines and lines[0].startswith("#") else None

    # Remove blank lines to find the actual date line
    lines = lines[1:]
    while lines and lines[0].strip() == "":
        lines = lines[1:]

    # Extract date from next line (line 1 after heading)
    date_line = lines[0].strip() if lines else None
    if re.fullmatch(r'\d{2}-\d{2}-\d{4}', date_line):
        # Convert to YYYY-MM-DD
        date = datetime.strptime(date_line, "%d-%m-%Y").strftime("%Y-%m-%d")
        lines = lines[1:]  # Remove the date line
    else:
        date = None  # Optional: fallback or error handling

    # Remove leading blank lines after date
    while lines and lines[0].strip() == "":
        lines = lines[1:]

    # Build frontmatter
    frontmatter = ["---\n"]
    if title:
        frontmatter.append(f'title: "{title}"\n')
    if date:
        frontmatter.append(f"date: {date}\n")
    frontmatter.append("---\n\n")

    # Combine and write
    final_content = frontmatter + lines

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(final_content)

    print(f"[{filepath}] ✔ Frontmatter added.")

def process_markdown_files(root_folder):
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith(".md"):
                filepath = os.path.join(dirpath, filename)
                convert_to_frontmatter(filepath)

# 👇 Replace this with your folder path
root_folder = "coontent/Notes"
process_markdown_files(root_folder)
