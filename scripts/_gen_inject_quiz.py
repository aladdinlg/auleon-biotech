"""
Generator: reads quiz data from docs/quiz-inject-task.md and writes inject_quiz.py.
Run once: python3 scripts/_gen_inject_quiz.py
"""
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..")
MD   = os.path.join(ROOT, "docs", "quiz-inject-task.md")
OUT  = os.path.join(ROOT, "scripts", "inject_quiz.py")

text = open(MD, encoding="utf-8").read()

pattern = re.compile(
    r"### FILE \d+: src/data/modules/([\w-]+\.json)\s*\n"
    r"Replace the value of tabs\.quiz\.mcq with:\s*\n"
    r"(\[.*?\])\s*\n---",
    re.DOTALL,
)


def fix_unescaped_quotes(raw: str) -> str:
    """Escape unescaped inner double-quotes inside JSON string values."""
    lines = raw.split("\n")
    fixed = []
    for line in lines:
        # Pattern 1: "key": "value[,]" – key-value pair lines
        m = re.match(r'^(\s*"[^"]+"\s*:\s*")(.*)(")(\s*,?\s*)$', line)
        if m:
            inner = m.group(2).replace('"', '\\"')
            line = m.group(1) + inner + m.group(3) + m.group(4)
        else:
            # Pattern 2: standalone string array element – "value[,]"
            m = re.match(r'^(\s*")(.*)(")(\s*,?\s*)$', line)
            if m and "[" not in m.group(2) and "{" not in m.group(2):
                inner = m.group(2).replace('"', '\\"')
                line = m.group(1) + inner + m.group(3) + m.group(4)
        fixed.append(line)
    return "\n".join(fixed)


EXPECTED = [
    "m1-bio-foundation.json",
    "m2-eg95-vaccine.json",
    "m4-capripoxvirus.json",
    "m5-regulatory-ra.json",
    "m6-market-strategy.json",
]

VAR = {
    "m1-bio-foundation.json":  "M1_MCQ",
    "m2-eg95-vaccine.json":    "M2_MCQ",
    "m4-capripoxvirus.json":   "M4_MCQ",
    "m5-regulatory-ra.json":   "M5_MCQ",
    "m6-market-strategy.json": "M6_MCQ",
}

arrays = {}
for m in pattern.finditer(text):
    fname = m.group(1)
    raw_fixed = fix_unescaped_quotes(m.group(2))
    arrays[fname] = json.loads(raw_fixed)

for f in EXPECTED:
    assert f in arrays, f"Missing: {f}"
    assert len(arrays[f]) == 15, f"{f} => {len(arrays[f])} questions"

print("Parsed OK. Writing inject_quiz.py ...")

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write("import json\nimport os\nimport subprocess\n\n")
    fh.write("BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'modules')\n\n")

    for fname in EXPECTED:
        var  = VAR[fname]
        data = json.dumps(arrays[fname], ensure_ascii=False, indent=2)
        # Escape backslashes so Python doesn't consume them when reading the
        # triple-single-quoted string (e.g. \" → \\" so Python sees \\+\" → \")
        data_embedded = data.replace("\\", "\\\\")
        fh.write(f"# {var}\n")
        fh.write(f"{var} = json.loads('''\n{data_embedded}\n''')\n\n")

    fh.write("FILES = [\n")
    for fname in EXPECTED:
        fh.write(f"    ('{fname}', {VAR[fname]}),\n")
    fh.write("]\n\n")

    fh.write(
        "for filename, mcq in FILES:\n"
        "    path = os.path.join(BASE, filename)\n"
        "    with open(path, 'r', encoding='utf-8') as f:\n"
        "        data = json.load(f)\n"
        "    data['tabs']['quiz']['mcq'] = mcq\n"
        "    with open(path, 'w', encoding='utf-8') as f:\n"
        "        json.dump(data, f, ensure_ascii=False, indent=2)\n"
        "\n"
        "print('Write summary:')\n"
        "for filename, mcq in FILES:\n"
        "    print(f'  {filename} -> {len(mcq)} questions')\n"
        "\n"
        "print('\\nVerification (grep -c correctIndex):')\n"
        "for filename, _ in FILES:\n"
        "    rel = f'src/data/modules/{filename}'\n"
        "    r = subprocess.run(['grep', '-c', 'correctIndex', rel],\n"
        "                       capture_output=True, text=True,\n"
        "                       cwd=os.path.join(os.path.dirname(__file__), '..'))\n"
        "    n = r.stdout.strip()\n"
        "    status = 'OK' if n == '15' else f'FAIL (got {n})'\n"
        "    print(f'  {rel}: {n}  [{status}]')\n"
    )

print(f"Written: {OUT}")
