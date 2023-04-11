const { parse, print } = require('recast');
const { Type, builtInTypes, builders: b, finalize } = require('ast-types');
const { def } = Type;
const { string } = builtInTypes;
const { importNames } = require('./utils/tools.js');
const { getCode, getImportSpecs } = require('./tmp/service.js');
const fs = require('fs');
const path = require('path');
const { KIND, K8SCR } = require('./utils/constant.js');

const kind = KIND[process.argv[2]] || KIND.pod;
const k8scr = K8SCR[process.argv[2]] || K8SCR.pod;

const filename = `${kind.toLocaleLowerCase()}.service.ts`;
const ast = parse(getCode(kind, k8scr), {
  parser: require("recast/parsers/typescript")
});

def("File")
  .bases("Node")
  .build("name", "program")
  .field("name", string)
  .field("program", def("Program"));

finalize();

const imports = getImportSpecs(kind).map(function(d) {
  return importNames(d.names.map(function(c) {
    return b.identifier(c)
  }), d.source);
});

const service_ts = b.file(filename, b.program(imports.concat(ast.program.body[0])))

const result = print(service_ts);
fs.readdir(path.join(__dirname, '../dist'), function(err) {
  if (err) {
    fs.mkdir(path.join(__dirname, '../dist'), { recursive: true }, function(err) {
      if (err) {
        console.error(err)
        return;
      };
      fs.writeFile(path.join(__dirname, `../dist/${filename}`), result.code, function(err) {
        if (err) {
          console.error(err)
        }
      });
    })
    return;
  }
  fs.writeFile(path.join(__dirname, `../dist/${filename}`), result.code, function(err) {
    if (err) {
      console.error(err)
    }
  });
})
