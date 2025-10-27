/*CMD
  command: acs
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

var now = Math.floor(Date.now() / 1000);

var untilUser = User.getProperty("access_until");
var untilBot = Bot.getProperty("access_until_" + user.telegramid);

var until = 0;
if (untilUser && untilBot) {
  until = Math.max(parseInt(untilUser), parseInt(untilBot));
} else if (untilUser) {
  until = parseInt(untilUser);
} else if (untilBot) {
  until = parseInt(untilBot);
}

var remaining = until - now;
if (!until || remaining <= 0) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Your access time has expired.\nGet free access via referral or purchase it.",
    show_alert: true
  });
  return;
}

var days = Math.floor(remaining / 86400);
var hours = Math.floor((remaining % 86400) / 3600);
var minutes = Math.floor((remaining % 3600) / 60);

var msg = "✅ Remaining Access Time:\n";
if (days > 0) {
  msg += days + "d " + hours + "h " + minutes + "m";
} else if (hours > 0) {
  msg += hours + "h " + minutes + "m";
} else {
  msg += minutes + "m";
}

Api.answerCallbackQuery({
  callback_query_id: request.id,
  text: msg,
  show_alert: true
});

