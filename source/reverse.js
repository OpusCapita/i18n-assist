/*
  Author : Mayank Agarwal
  Date : 16/6/17
 */

var convertExcel = require('excel-as-json').processFile;
var writeFile = require('write');
var program = require('commander');
 
program
  .version('0.1.0')
  .option('--path <dir>', 'Add path')
  .parse(process.argv);
 
if (program.path) program.path += 'translations.xlsx';
else program.path = './translations.xlsx';

convertExcel('translations.xlsx', null, {isColOriented: true, omitEmptyFields: true}, (err, data)=> {
	let string = "";
	//Put back english strings
	if(data) {
		for(let folder in data[0]){
			if(folder != 'Path to file'){
				for(let obj in data[0][folder]){
				string += "\t" + obj + ": " + JSON.stringify(data[0][folder][obj], null, '\t\t') + ",\n"
				}
				writeFile('./src/client/components' + folder + '/i81n/en.js', "export default { \n" + string + "\n}", function(err) {
				  if (err) console.log(err);
				});
			}
		}
	//Put back german strings
		for(let folder in data[1]){
			if(folder != 'Path to file'){
				for(let obj in data[1][folder]){
				string += "\t" + obj + ": " + JSON.stringify(data[1][folder][obj], null, '\t\t') + ",\n"
				}
				writeFile('./src/client/components' + folder + '/i81n/de.js', "export default { \n" + string + "\n}", function(err) {
				  if (err) console.log(err);
				});
			}
		}
	} else {
		console.log("Could not find translations.xlsx");
	}
});
