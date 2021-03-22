const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('スタンプリスト');

const userRangeData = sheet.getRange('A:A').getValues();
const messageRangeData = sheet.getRange('B:B').getValues();

const _ = Underscore.load();
const userList = _.filter(_.flatten(userRangeData));
const messageList = _.filter(_.flatten(messageRangeData));

const doGet = (e) => {
  const discordName = e.parameter.name;
  const discordMessage = e.parameter.message;
  judgeStamp(discordName, discordMessage);
}

function judgeStamp(name, message) {
  const resultIndex = checkIndex(name, message);
  if (resultIndex == "") {
    var stampDefaultRow = 0;
    const stampLastRow = calcLastRow(userRangeData, stampDefaultRow);
    sheet.getRange(stampLastRow + 1, 1).setValue([name]);
    var messageDefaultRow = 0;
    const messageLastRow = calcLastRow(messageRangeData, messageDefaultRow);
    sheet.getRange(messageLastRow + 1, 2).setValue([message]);
  } else {
    const searchMessageId = resultIndex[0];
    sheet.deleteRow(searchMessageId + 1);
  }
}

function checkIndex(name, message) {
  const userIndex = searchIndex(name, userList);
  const messageIndex = searchIndex(message, messageList);
  const totalIndex = [...userIndex, ...messageIndex];
  const resultIndex = totalIndex.filter(
    num => userIndex.includes(num) && messageIndex.includes(num)
  )
  return resultIndex;
}

function searchIndex(data, List) {
  var indexList =[];
  var searchData = List.indexOf(data);
  while (searchData != -1) {
    indexList.push(searchData);
    searchData = List.indexOf(data, searchData + 1);
  }
  return indexList
}

function calcLastRow (data, defaultRow) {
  for(var i=0; i<data.length; i++){
    if(data[i][0]){
      defaultRow = i + 1;
    }
  }
  return defaultRow;
}

