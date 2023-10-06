import * as ts from 'typescript';

const tmpSubstituteLower= 'componentplan';
const tmpSubstituteUpper= 'Componentplan';

export default (substitute: string): ts.TransformerFactory<ts.SourceFile> => {
  const substituteLower = substitute.replace(/^(\w)/, (_, p1) => p1.toLowerCase());
  const substituteUpper = substitute.replace(/^(\w)/, (_, p1) => p1.toUpperCase());

  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      const visitor = (node: ts.Node): ts.Node => {
        if (ts.isIdentifier(node)) {
          const text = node.text;
          const transformText = text.replace(new RegExp(tmpSubstituteLower, 'g'), substituteLower)
                                    .replace(new RegExp(tmpSubstituteUpper, 'g'), substituteUpper);
          return ts.factory.createIdentifier(transformText);
        }
        if (ts.isStringLiteral(node)) {
          const text = node.text;
          const transformText = text.replace(new RegExp(tmpSubstituteLower, 'g'), substituteLower)
                                    .replace(new RegExp(tmpSubstituteUpper, 'g'), substituteUpper);
          return ts.factory.createStringLiteral(transformText);
        }
        return ts.visitEachChild(node, visitor, ctx);
      };
      return <ts.SourceFile> ts.visitEachChild(sourceFile, visitor, ctx);
    };
  };
}
