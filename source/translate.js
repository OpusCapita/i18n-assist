/*
  Author : Mayank Agarwal
  Date : 16/6/17
 */

var filewalker = require('filewalker');
var excelbuilder = require('msexcel-builder');
var _ = require('underscore');
var translationFiles = [];
var arr = {};
var program = require('commander');
 
program
  .version('0.1.0')
  .option('--path <dir>', 'Add path')
  .parse(process.argv);
 
if (!program.path) program.path = '../../src/client/components';

/* Traverse through directory and get paths of all translation files */
filewalker(program.path)
  .on('file', function(p, s) {
    if(p.indexOf('en.js') !== -1 || p.indexOf('de.js') !== -1)
      translationFiles.push(p);
  })
  .on('error', function(err) {
    console.error(err);
  })
  .on('done', function(){
    getTranslationJSON();
  })
.walk();

/* 
  Now  fetch the json from each file, flatten and as use as path
  Write to xlsx and json
*/
let getTranslationJSON = () => {
  if(translationFiles.length){
    for(let filesLength = 0; filesLength < translationFiles.length; filesLength++){

      let translationObjects = require(program.path + translationFiles[filesLength]).default;
      let fname = translationFiles[filesLength].substr(0, translationFiles[filesLength].indexOf('/'));
      let lang = translationFiles[filesLength].slice(translationFiles[filesLength].length - 5, translationFiles[filesLength].length - 3);

      let flatObj = flattenObject(translationObjects, lang, fname);
       _.each(flatObj, function(value, key) {
            key = fname + '.' + key;
            if(arr[key])
              arr[key][lang] = value;
            else
              arr[key] = {
                [lang] : value
              }
        });
    }
    var workbook = excelbuilder.createWorkbook('../../', 'translation.xlsx');
    var sheet1 = workbook.createSheet('Sheet1', 3, Object.keys(arr).length + 2);
    sheet1.width(1, 50);
    sheet1.set(1, 1, "Path to file");
    sheet1.width(2, 150);
    sheet1.set(2, 1, "English Translation");
    sheet1.width(3, 150);
    sheet1.set(3, 1, "German Translation");
    let rowCount = 3;
    for(let obj in arr){
      sheet1.set(1, rowCount, obj);
      sheet1.set(2, rowCount, arr[obj].en);
      sheet1.set(3, rowCount, arr[obj].de);
      rowCount++;
    }
    workbook.save(function(ok){
      console.log('Excel saved as translation.xlsx');
    });
  } else {
      console.log("No translation files found");
  }
}

/* Function to flatten a object */
var flattenObject  = (ob, lang, fname) => {
  var toReturn = {};
  
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    
    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i], lang, fname);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};



