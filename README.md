# i18n-assist

### Gather the strings

Use `npm run translate` to gather all the strings from the i18n folders in the  current project into a single excel file (translation.xlsx). 

The excel has 3 columns, 

| Path to file | English translation | German translation |
| ------------ | ------------------- | ------------------ |

NOTE: DO NOT MODIFY THE 'PATH TO FILE' COLUMN. 
This is needed to put back the strings in the correct files.

### Put back the strings

After the translation is done, use `npm run reverse` to automatically update the language files from which the strings were taken. 