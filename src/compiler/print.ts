import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import transformer from './transformer';

const tmpSubstituteLower= 'componentplan';

function generateCode(sourceFile: ts.SourceFile, transformedSourceFile: ts.SourceFile): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printNode(
    ts.EmitHint.Unspecified,
    transformedSourceFile,
    sourceFile
  );
}

export default function print(filePaths: string[], substitute: string) {
  const program = ts.createProgram(filePaths, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  });

  const sourceFiles = program.getSourceFiles();

  for (const sourceFile of sourceFiles) {
    if (sourceFile?.isDeclarationFile === false && sourceFile?.fileName) {
      const result = ts.transform(sourceFile, [transformer(substitute)])
      const transformed = result.transformed[0];
      const newCode = generateCode(sourceFile, transformed);

      const fileName = sourceFile.fileName;
      const newPartialPath = path.join(__dirname, "../../gen/", fileName.replace(/^.*\/tmp\//, ''));
      const newFileName = newPartialPath.replace(new RegExp(tmpSubstituteLower, 'g'), substitute);
      const newDir = newFileName.slice(0, newFileName.lastIndexOf('/'));

      fs.mkdir(newDir, { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile(newFileName, newCode, (error) => {
          if (error) throw error;
        })
      })
    }
  }
}