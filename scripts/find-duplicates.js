import fs from 'fs';

function findDuplicates(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const duplicates = [];

  // Stack of scopes
  const stack = [new Map()];

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    const lineNum = lineIdx + 1;

    // Check if line contains a key definition: "key":
    const match = trimmed.match(/^"([^"]+)"\s*:\s*(.*)$/);
    if (match) {
      const key = match[1];
      const rest = match[2];
      const currentScope = stack[stack.length - 1];

      if (currentScope.has(key)) {
        duplicates.push({
          key,
          line: lineNum,
          prevLine: currentScope.get(key)
        });
      } else {
        currentScope.set(key, lineNum);
      }

      if (rest.startsWith('{')) {
        stack.push(new Map());
      }
    } else if (trimmed.startsWith('{')) {
      stack.push(new Map());
    }

    if (trimmed.endsWith('},') || trimmed.endsWith('}') || trimmed === '},' || trimmed === '}') {
      if (stack.length > 1) {
        stack.pop();
      }
    }
  });

  return duplicates;
}

['src/i18n/uz.json', 'src/i18n/ru.json'].forEach((file) => {
  console.log(`Checking ${file}...`);
  const dups = findDuplicates(file);
  if (dups.length === 0) {
    console.log(`  No duplicates found.`);
  } else {
    dups.forEach((d) => {
      console.log(`  Duplicate key "${d.key}" at line ${d.line} (previously defined at line ${d.prevLine})`);
    });
  }
});
