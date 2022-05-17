const https = require("https")
const express = require("express")
var router = express.Router();
const line = require('@line/bot-sdk');

router.get("/", (req, res) => {
  res.sendStatus(200)
})

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

router.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);
async function handleEvent(event) {

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const anwser = { type: 'text', text: await getAnwser(event.message.text) };
  return client.replyMessage(event.replyToken, anwser);
}

function getAnwser(input_text) {
  return new Promise(resolve => {
    const {PythonShell} = require("python-shell");

    var options = {
      pythonPath: 'Python',
      pythonOptions: ['-u'],
      scriptPath: './'
    }

    console.log()

    var pyshell = new PythonShell('chatbot.py');

    // sends a message to the Python script via stdin
    var data = {
      input_text: input_text
    };
    pyshell.send(JSON.stringify(data));

    pyshell.on('message', function (message) {
      // received a message sent from the Python script (a simple "print" statement)
      console.log("結果：" + message);
      result =message;
    });

    // end the input stream and allow the process to exit
    pyshell.end(function (err, code, signal) {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      resolve(result);
    });
  })
}


// router.post("/webhook", function(req, res) {
//   res.send("HTTP POST request sent to the webhook URL!")
//   // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
//   if (req.body.events[0].type === "message") {
//     // 文字列化したメッセージデータ
//     const dataString = JSON.stringify({
//       replyToken: req.body.events[0].replyToken,
//       messages: [
//         {
//           "type": "text",
//           "text": "Hello, user"
//         },
//         {
//           "type": "text",
//           "text": "May I help you?"
//         }
//       ]
//     })

//     // リクエストヘッダー
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + TOKEN
//     }

//     // リクエストに渡すオプション
//     const webhookOptions = {
//       "hostname": "api.line.me",
//       "path": "/v2/bot/message/reply",
//       "method": "POST",
//       "headers": headers,
//       "body": dataString
//     }

//     // リクエストの定義
//     const request = https.request(webhookOptions, (res) => {
//       res.on("data", (d) => {
//         process.stdout.write(d)
//       })
//     })

//     // エラーをハンドル
//     request.on("error", (err) => {
//       console.error(err)
//     })

//     // データを送信
//     request.write(dataString)
//     request.end()
//   }
// })

module.exports = router;