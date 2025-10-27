/*CMD
  command: menu2
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

if (!Bot.getProperty("user_" + user.telegramid)) {
  var now = Math.floor(Date.now() / 1000);
  var extra = 24 * 60 * 60;

  var untilUser = User.getProperty("access_until");
  var untilBot = Bot.getProperty("access_until_" + user.telegramid);

  var currentUntil = 0;
  if (untilUser && untilBot) {
    currentUntil = Math.max(parseInt(untilUser), parseInt(untilBot));
  } else if (untilUser) {
    currentUntil = parseInt(untilUser);
  } else if (untilBot) {
    currentUntil = parseInt(untilBot);
  }
  if (!currentUntil || currentUntil < now) {
    currentUntil = now;
  }

  var newUntil = currentUntil + extra;

  User.setProperty("access_until", newUntil, "integer");
  Bot.setProperty("access_until_" + user.telegramid, newUntil, "integer");

  Bot.setProperty("user_" + user.telegramid, true, "boolean");

  Bot.sendMessage("🎉 Welcome " + user.first_name + "!\nYou received *24 Hours Free Access* ✅", { parse_mode: "Markdown" });
}

// handle referral
let refUser = User.getProperty("refer_by");
if (refUser) {
  var now = Math.floor(Date.now() / 1000);
  var extra = 24 * 60 * 60;

  var untilRefUser = Bot.getProperty("access_until_" + refUser);
  var untilUserRef = User.getProperty("access_until_" + refUser);

  var currentUntil = 0;
  if (untilUserRef && untilRefUser) {
    currentUntil = Math.max(parseInt(untilUserRef), parseInt(untilRefUser));
  } else if (untilUserRef) {
    currentUntil = parseInt(untilUserRef);
  } else if (untilRefUser) {
    currentUntil = parseInt(untilRefUser);
  }
  if (!currentUntil || currentUntil < now) {
    currentUntil = now;
  }

  var newUntil = currentUntil + extra;
  User.setProperty("access_until", newUntil, "integer");
  Bot.setProperty("access_until_" + refUser, newUntil, "integer");

  var remaining = newUntil - now;
  var days = Math.floor(remaining / 86400);
  var hours = Math.floor((remaining % 86400) / 3600);
  var minutes = Math.floor((remaining % 3600) / 60);

  Api.sendMessage({
    chat_id: refUser,
    text: "🙋 User: @" + user.username + " joined through your link.\n\n✅ Reward: You got +24 Hours Access\n\n⏳ Now, Your Access will expire in: " + days + " days " + hours + " hours " + minutes + " minutes",
    parse_mode: "Markdown"
  });
  User.setProperty("refer_by", null);
}

// show menu
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
if (remaining <= 0) {
  var days = 0, hours = 0, minutes = 0;
} else {
  var days = Math.floor(remaining / 86400);
  var hours = Math.floor((remaining % 86400) / 3600);
  var minutes = Math.floor((remaining % 3600) / 60);
}

Api.editMessageMedia({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
  media: {
    type: "photo",
    media: "https://ibb.co/6d86df6",
    caption: (remaining <= 0 ? "❌ Your Access has Expired\n\nThis is an Advanced OSINT Bot\n\n>You Can search information from various methods\n\nClick Below to use 👇" : 
      "✅ Your Access Will Expire in: " + days + " days " + hours + " hours " + minutes + " minutes\n\nThis is an Advanced OSINT Bot\n\n>You Can search information from various methods\n\nClick Below to use 👇"),
    parse_mode: "Markdown"
  },
  reply_markup: {
    inline_keyboard: [
      [{ text: "🪪 Search Information", callback_data: "src" }],
      [{ text: "✅ Get Free Access", callback_data: "bal" }]
    ]
  },
  on_result: "/p"
});

