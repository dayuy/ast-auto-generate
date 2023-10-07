import * as path from 'path';
import print from './print';

const tempPath = path.join(__dirname, '../tmp/componentplan/componentplan.module.ts');
const substitute = 'subscript';

// compile([tempPath], substitute, (fileName: string, text: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[], data?: ts.WriteFileCallbackData) => {
//   const newPartialPath = path.join(__dirname, "../../gen/", fileName.replace(/^.*\/tmp\//, ''));
//   const newFileName = newPartialPath.replace(new RegExp(tmpSubstituteLower, 'g'), substitute);
//   const newDir = newFileName.slice(0, newFileName.lastIndexOf('/'));

//   fs.mkdir(newDir, { recursive: true }, (err) => {
//     if (err) throw err;
//     fs.writeFile(newFileName, text, (error) => {
//       if (error) throw error;
//     })
//   })
// })

print([tempPath], substitute);
