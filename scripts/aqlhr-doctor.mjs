#!/usr/bin/env node
// AqlHR Doctor — minimal codemod to stop route/i18n regressions
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const root = process.cwd();
const globs = ['src/**/*.{ts,tsx,js,jsx}'];

const isRouteFile = (p) =>
  /AppRoutes\.tsx$/.test(p) || /config\/routes\.tsx$/.test(p);

const ensureImport = (code, imp, from) => {
  const line = `import ${imp} from '${from}';`;
  if (code.includes(line)) return code;
  // insert after first import
  const idx = code.indexOf('import ');
  if (idx >= 0) {
    const end = code.indexOf('\n', idx);
    return code.slice(0, end + 1) + line + '\n' + code.slice(end + 1);
  }
  return line + '\n' + code;
};

const fixLinks = (code, file) => {
  // 1) transform <Link to="/xyz"> -> <LinkL to="xyz">
  if (code.includes(' to="/')) {
    code = ensureImport(code, '{ LinkL }', '@/lib/i18n/LinkL');
    code = code.replace(/<Link(\s+[^>]*?)\s+to="\/([^"]+)"([^>]*)>/g, '<LinkL$1 to="$2"$3>');
  }
  // 2) transform navigate('/xyz') -> navigate(localePath('xyz'))
  if (code.includes("navigate('/") || code.includes('navigate("/')) {
    code = ensureImport(code, '{ localePath }', '@/lib/i18n/localePath');
    code = code
      .replace(/navigate\('\/([^']+)'\)/g, "navigate(localePath('$1'))")
      .replace(/navigate\(\"\/([^\"]+)\"\)/g, "navigate(localePath('$1'))");
  }
  return code;
};

const fixRoutePaths = (code) => {
  // Only inside route files, drop leading slash in path props/objects: path: "/foo" -> path: "foo"
  return code
    .replace(/path:\s*\"\/([^"]+)\"/g, 'path: "$1"')
    .replace(/<Route\s+path=\"\/([^"]+)\"/g, '<Route path="$1"');
};

const run = async (apply = true) => {
  const files = await fg(globs, { cwd: root, dot: false, absolute: true });
  let changed = 0, scanned = 0;

  for (const file of files) {
    let code = fs.readFileSync(file, 'utf8');
    const before = code;

    code = fixLinks(code, file);
    if (isRouteFile(file)) code = fixRoutePaths(code);

    scanned++;
    if (code !== before) {
      changed++;
      const bak = file + '.doctor.bak';
      if (apply) {
        if (!fs.existsSync(bak)) fs.writeFileSync(bak, before, 'utf8');
        fs.writeFileSync(file, code, 'utf8');
        console.log('✔️  fixed', path.relative(root, file));
      } else {
        console.log('~ would fix', path.relative(root, file));
      }
    }
  }

  console.log(`\nAqlHR Doctor scanned ${scanned} files, changed ${changed}.`);
  console.log('Tip: commit *.doctor.bak for rollback safety or delete once happy.\n');
};

const arg = process.argv[2];
run(arg !== 'dry');