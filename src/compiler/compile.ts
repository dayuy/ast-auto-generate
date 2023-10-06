import * as ts from 'typescript';
import transformer from './transformer';

export default function compile(filePaths: string[], substitute: string, writeFileCallback?: ts.WriteFileCallback) {
  const program = ts.createProgram(filePaths, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    charset: 'utf-8',
  });

  const transformers: ts.CustomTransformers = {
    before: [transformer(substitute)],
    after: [],
  };

  const { emitSkipped, diagnostics } = program.emit(undefined, writeFileCallback, undefined, false, transformers);

  if (emitSkipped) {
    throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
  }
}