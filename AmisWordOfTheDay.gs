var token = "你的權杖"; // LINE Notify Token

function notifyDailyWord() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("秀姑巒阿美初級");
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  var notNotifiedWords = values.slice(1).filter(function(row) {
    return row[3] !== "已練習"; // 標記為不要重複抽取
  }); 

  if (notNotifiedWords.length > 0) {
    var randomIndex = Math.floor(Math.random() * notNotifiedWords.length); // 隨機抽一個單詞
    var wordRow = notNotifiedWords[randomIndex];

    // 建構族語之火合成服務的URL
    var audioUrl = "https://hts.ithuan.tw/%E6%96%87%E6%9C%AC%E7%9B%B4%E6%8E%A5%E5%90%88%E6%88%90?%E6%9F%A5%E8%A9%A2%E8%85%94%E5%8F%A3=Pangcah&%E6%9F%A5%E8%A9%A2%E8%AA%9E%E5%8F%A5=" + encodeURIComponent(wordRow[2]);


// 打印或检查生成的URL
console.log(audioUrl);




    var message = '今日單詞\n' +
                  '族語：' + wordRow[2] + '\n' +
                  '中文：' + wordRow[1] + '\n' +
                  '類別：' + wordRow[0] + '\n' +
                  '聽發音：' + audioUrl;
                  
    // 標題列不抽取
    var originalRowIndex = values.findIndex(function(row) {
      return row[0] === wordRow[0] && row[1] === wordRow[1] && row[2] === wordRow[2];
    });
    sheet.getRange(originalRowIndex + 1, 4).setValue("已練習"); // 更新標示為"已練習"

    sendLine(message, token); // 發送LINE通知
  } else {
    var message = '所有單詞都已練習過。';
    sendLine(message, token); // 如果所有單詞都練習過，發送提示
  }
}

function sendLine(message, token) {
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + token
    },
    'payload': {
      'message': message,
    },
    'muteHttpExceptions': true
  });
}
