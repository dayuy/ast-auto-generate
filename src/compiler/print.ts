import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import transformer from './transformer';
import { spawn } from 'child_process';

const tmpSubstituteLower= 'componentplan';

function generateCode(sourceFile: ts.SourceFile, transformedSourceFile: ts.SourceFile): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printNode(
    ts.EmitHint.Unspecified,
    transformedSourceFile,
    sourceFile
  );
}

function prettierFile(fileName: string) {
  const eslint = spawn('npx', ['eslint', '--fix', fileName]);
  eslint.on('close', (code) => {
    if (code === 0) {
      const prettier = spawn('npx', ['prettier', '--parser=typescript', '--write', fileName]);
      prettier.stderr.on('data', (data) => {
        console.error(data);
      })
      prettier.on('close', (code) => {
        if (code === 0) {
          console.info(`\nCREATE ${fileName}`);
        } else {
          console.error(`\nFailed to prettier ${fileName}`);
        }
      })
    } else {
      console.error(`\nFailed to eslint ${fileName}`);
    }
  })
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
      const cwd = process.cwd();
      const newPartialPath = path.join(cwd, "./src/", fileName.replace(/^.*\/tmp\//, ''));
      const newFileName = newPartialPath.replace(new RegExp(tmpSubstituteLower, 'g'), substitute);
      const newDir = newFileName.slice(0, newFileName.lastIndexOf('/'));

      fs.mkdir(newDir, { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile(newFileName, newCode, (error) => {
          if (error) throw error;
          prettierFile(newFileName);
        })
      })
    }
  }
}
