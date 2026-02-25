const path = require("node:path");
const fs = require("node:fs");
const Module = require("module");
const ts = require("typescript");

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  allowJs: true
};

const compileTs = (code, filename) =>
  ts.transpileModule(code, {
    compilerOptions,
    fileName: filename
  }).outputText;

const extensions = [".ts", ".tsx"];
extensions.forEach((ext) => {
  require.extensions[ext] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const compiled = compileTs(source, filename);
    module._compile(compiled, filename);
  };
});

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const resolvedPath = path.resolve(__dirname, "../src", request.slice(2));
    return originalResolveFilename.call(this, resolvedPath, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require("../tests/run-tests.tsx");
