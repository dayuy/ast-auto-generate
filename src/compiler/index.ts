import * as path from 'path';
import * as fs from 'node:fs';
import * as ts from 'typescript';
import compile from './compile';

const tempPath = path.join(__dirname, '../tmp/componentplan/componentplan.module.ts');
const tmpSubstituteLower= 'componentplan';
const substitute = 'subscript';

function generateFile(sourceFile: ts.SourceFile): string {
  const printer = ts.createPrinter({});
  return printer.printFile(sourceFile);
}

compile([tempPath], substitute, (fileName: string, text: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[], data?: ts.WriteFileCallbackData) => {
  const newPartialPath = path.join(__dirname, "../../gen/", fileName.replace(/^.*\/tmp\//, ''));
  const newFileName = newPartialPath.replace(new RegExp(tmpSubstituteLower, 'g'), substitute);
  const newDir = newFileName.slice(0, newFileName.lastIndexOf('/'));

  fs.mkdir(newDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(newFileName, text, (error) => {
      if (error) throw error;
    })
  })
  // if (fileName === '/Users/yangqian/Desktop/owner/ast-auto-generate/src/tmp/componentplan/componentplan.resolver.js') {
  //   console.log('---text--', text)
  //   console.log('---writeByteOrderMark--', writeByteOrderMark)
  //   console.log('---sourceFiles--', sourceFiles)
  //   console.log('---data--', data)
  //   if (sourceFiles && sourceFiles[0]) {
  //     const updatedCode = generateFile(sourceFiles[0])
  //     console.log('-----updatedCode: ', updatedCode)
  //   }
  // }
})