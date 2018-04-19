// Convert a JSON object to a MySQL Command Line Monitor-like table
// N.B. this is by no means a general solution. Right now, it will
//      only work for this project as implemented in this initial
//      version.
//      TODO: refactor this code into a more general solution, or 
//            find an npm module that can format a table-like display
//            from a result set.

'use strict';

var accounting = require('accounting');

function JSONToTable(resultSet, fields) {
  // Note: resultSet is an array of objects which contain column names
  //       as properties and row/column contents as values
  //
  //       fields is an array of objects which contain 14 (at this time)
  //       property/value pairs about a single column
  var rowCount = resultSet.length;
  var firstRow = resultSet[0];  
  var keyStrings = Object.keys(firstRow);  // array of column names
  var colCount = keyStrings.length;        // number of column names
  const PADDING   = 4;
  const INTEGER   = 3;
  const MEDIUMINT = 9;
  const VARCHAR   = 253;
  const DECIMAL   = 246;

  var columnWidths = [];

  // first, determine the minimum width of each column
  for (var i = 0; i < colCount; i++) {
    columnWidths.push(keyStrings[i].length + PADDING) ; 
  }

  // Note: strings are left-justified, numbers are right-justified
  // Get the data type of each column
  var dataTypes = [];
  var columnType;
  for (var i = 0; i < colCount; i++) {
    columnType = fields[i].type;
    dataTypes.push(columnType);
  }

  // Now, add in any extra width that is needed to display
  // the column value with the greatest width
  for (var i = 0; i < colCount; i++) {
    for(var j = 0; j < rowCount; j++) {
      var value = resultSet[j][keyStrings[i]];
      var valLen;
      if (dataTypes[i] !== DECIMAL)
      {
        valLen = value.length;
      } else {
        valLen = accounting.formatMoney(value).length;
      }

      if (valLen > (columnWidths[i] - PADDING)) {
        columnWidths[i] += (valLen - (columnWidths[i] - PADDING));
      } else {
        // TODO: debug the code that should go here
      }
    }
  }

  var horizBorder = '';

  for (var i = 0; i < colCount; i++) {
    horizBorder += '+-';
    for(var j = 0; j <= (columnWidths[i]-PADDING); j++) {
      horizBorder += '-';
    }
  }
  horizBorder += '-+\n';

  var headingLine = '';
  var numSpaces;

  for (var i = 0; i < colCount; i++) {
    headingLine += '| ';
    headingLine += (keyStrings[i] + ' ');
    numSpaces = columnWidths[i]-PADDING-keyStrings[i].length;
    for (var j = 0; j < numSpaces; j++) {
      headingLine += ' ';
    }
  }
  headingLine += ' |\n';

  var tableString = '';
  var rowString;
  var leftPadding;
  var rightPadding;

  tableString += (horizBorder + headingLine + horizBorder);

  for (var j = 0; j < rowCount; j++) {
    rowString = '| ';

    for (var i = 0; i < colCount; i++) {
      var value = resultSet[j][keyStrings[i]];
      if (typeof value === 'number') { value = value.toString(); }
      var valLen = value.length;
      leftPadding = 0;

      switch (dataTypes[i]) {
        case DECIMAL :
          // right justify
          value = accounting.formatMoney(value);
          valLen = value.length;
          leftPadding = 2;

        case INTEGER :
        case MEDIUMINT:
          // right justify
          leftPadding += (columnWidths[i]-PADDING-valLen);
          for (var k = 0; k < leftPadding; k++) {rowString += ' ';}
          rowString += value;
          rowString += ' |';
          break;

        case VARCHAR :
          // left justify
          rowString += value;
          rightPadding = (columnWidths[i]-PADDING-valLen+1);
          for (var k = 0; k < rightPadding; k++) {rowString += ' ';}
          rowString += ' |';
          break;

        default :
          var error = new Error('Unanticipated datatype: ' + dataTypes[i]);
          error.name = 'Unhandled datatype';
          throw error;
      }        
    }

    tableString += (rowString + '\n');
  }

  tableString += horizBorder;

  return tableString;
}

module.exports = {
  format : JSONToTable
};
