/*CMD
  command: bal
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var total_ref = Bot.getProperty("total_ref" + user.telegramid) || 0;
var balance = Libs.ResourcesLib.userRes("balance");
var now = Math.floor(Date.now() / 1000);

// get both values
var untilUser = User.getProperty("access_until");
var untilBot = Bot.getProperty("access_until_" + user.telegramid);

// pick the greater one
var until = 0;
if (untilUser && untilBot) {
  until = Math.max(parseInt(untilUser), parseInt(untilBot));
} else if (untilUser) {
  until = parseInt(untilUser);
} else if (untilBot) {
  until = parseInt(untilBot);
}

var remaining = until - now;
if (remaining <= 0) {
  var days = 0, hours = 0, minutes = 0;
} else {
  var days = Math.floor(remaining / 86400);
  var hours = Math.floor((remaining % 86400) / 3600);
  var minutes = Math.floor((remaining % 3600) / 60);
}

var caption;
if (remaining <= 0) {
  caption = "*❌ Your access time has expired*\n\n⚜️ You can get extra free time via refer!!!\n\n💰 Invite Users And get 24 hours per user.\n\n💹 Your Link: https://t.me/" +
            bot.name + "?start=" + user.telegramid +
            "\n\n• You can use this bot in group for free, no access time required in group!! @IntelXGroup";
} else {
  caption = "*⚠ Your Access will Expire in: " + days + " days " + hours + " hours " + minutes + " minutes*\n\n⚜️ You can get extra free time via refer!!!\n\n💰 Invite Users And get 24 hours per user.\n\n💹 Your Link: https://t.me/" +
            bot.name + "?start=" + user.telegramid +
            "\n\n• You can use this bot in group for free, no access time required in group!! @IntelXGroup";
}

Api.editMessageCaption({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
  caption: (remaining <= 0
    ? "❌ <b>Your access time has expired</b>\n\n⚜️ You can get extra free time via refer!!!\n\n💰 Invite Users And get 24 hours per user.\n\n💹 <b>Your Link</b>: https://t.me/" + bot.name + "?start=" + user.telegramid +
      "\n\n• You can use this bot in group for free, no access time required in group!! @IntelXGroup"
    : "⚠ <b>Your Access will Expire in:</b> " + days + " days " + hours + " hours " + minutes + " minutes\n\n⚜️ You can get extra free time via refer!!!\n\n💰 Invite Users And get 24 hours per user.\n\n💹 <b>Your Link</b>: https://t.me/" + bot.name + "?start=" + user.telegramid +
      "\n\n• You can use this bot in group for free, no access time required in group!! @IntelXGroup"),
  parse_mode: "HTML",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [{ text: "⚡ Buy Paid Access", callback_data: "buy" }],
      [{ text: "< Back", callback_data: "menu2" }]
    ]
  }
});

