const discord = require("discord.js");
const client = new discord.Client();

const http = require("http");
const requestPromise = require("request-promise");
const querystring = require("querystring");

// Glitch稼働開始合図
client.on('ready', () => {
  console.log("bot is ready!");
});

// 任意の投稿にスタンプが押されたら
client.on('messageReactionAdd', (reaction, user) => {
  StampSend(reaction, user);
});

// 任意の投稿にスタンプが外されたら
client.on('messageReactionRemove', (reaction, user) => {
  StampSend(reaction, user);
});

// スタンプ情報をスプシに送信する
function StampSend(reaction, user) {
  if (reaction.message.author.username == 'ヘルプBot') {
    var url = process.env.GAS_URL;
    // spreadsheet URLにパラメータを付加
    url = `${url}?name=${user.username}&message=${reaction.message.id}`;
    // 文字コードの変換
    url = encodeURI(url);
    // API通信
    const doApi = async () => {
      try {
        const result = await requestPromise({
          uri: url,
          method: "GET"
        });
      } catch (error) {
        console.log("Error message: " + error.message);
      }
    };
    // 実行
    doApi();
  }
}

// GASを用いてbotを定期的に起動させる
http
  .createServer(function(req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        if (dataObject.type == "wake") {
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);


// ENV関係
if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

if (process.env.USER_ID == undefined) {
  console.log("please set ENV: USER_ID");
  process.exit(0);
}

if (process.env.CHANNEL_ID == undefined) {
  console.log("please set ENV: CHANNEL_ID");
  process.exit(0);
}

if (process.env.GAS_URL == undefined) {
  console.log("please set ENV: GAS_URL\nOR if you don't want to record playlog in spreadsheet, please comment out lines 42-70 and here.");
  process.exit(0);
}
