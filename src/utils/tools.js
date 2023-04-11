const { builders } = require('ast-types');

function importNames(
  names,
  source
) {
  return builders.importDeclaration(
    names.map((name) => builders.importSpecifier(name)),
    builders.stringLiteral(source)
  );
}

function classDeclaration(
  id,
  body,
  superClass,
  decorators
) {
  const declaration = builders.classDeclaration(id, body, superClass);
  if (!decorators.length) {
    return declaration;
  }

  //@ts-ignore
  declaration.decorators = decorators;
  return declaration;
}

module.exports = {
  importNames,
  classDeclaration,
}
