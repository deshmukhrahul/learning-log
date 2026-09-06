import re, os

def minify_css(content):
    # Remove CSS comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Collapse multiple whitespaces
    content = re.sub(r'\s+', ' ', content)
    # Remove spaces around delimiters
    content = re.sub(r'\s*([\{\}\:\;\,])\s*', r'\1', content)
    content = re.sub(r';\}', '}', content)
    return content.strip()

def minify_js(content):
    # Strip line comments that are not inside strings or URLs
    lines = []
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith('//'):
            continue
        lines.append(line)
    text = '\n'.join(lines)
    # Remove multi-line block comments (safe /* ... */)
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    # Collapse empty lines
    text = re.sub(r'\n\s*\n', '\n', text)
    return text.strip()

css_path = 'public/css/style.css'
js_path = 'public/js/app.js'

if os.path.exists(css_path):
    with open(css_path, 'r', encoding='utf-8') as f:
        c = f.read()
    orig_c = len(c)
    min_c = minify_css(c)
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(min_c)
    print(f"Minified CSS: {orig_c} -> {len(min_c)} bytes")

if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f:
        j = f.read()
    orig_j = len(j)
    min_j = minify_js(j)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(min_j)
    print(f"Minified JS: {orig_j} -> {len(min_j)} bytes")
