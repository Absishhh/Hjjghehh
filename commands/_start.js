/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🔎 search information 🔍
  group: 
CMD*/


if (request.chat && request.chat.type == "group") {
  Api.sendMessage({
    chat_id: request.chat.id,
    text: "👋 Hello everyone! Thanks for adding me to this group.\n\n" +
          "Make sure I am admin here so that I can work properly.\n\n" +
          "🤙 Group Commands:\n" +
          "/num - To extract details from any Indian number.\n" +
          "<i>Example: /num 9999999999</i>\n\n" +
          "/tg - To Extract User details from Telegram UserID\n" +
          "<i>Example: /tg 11111111</i>",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ℹ️ Help", callback_data: "help" },
          { text: "⚙️ Settings", callback_data: "settings" }
        ],
        [
          { text: "📢 Channel", url: "https://t.me/JackXsparrowxo" }
        ]
      ]
    }
  });
}
else {


  // First send the photo with caption and buttons
  Api.sendPhoto({
    photo: "https://i.ibb.co/5XZSLQxP/IMG-20250912-155017-047.jpg",
    caption:
      "Hey there <b>" + user.first_name + "</b> and welcome to <b>Number To Information Bot</b>\n\n" +
      "<u>⚠ Due to high traffic, only our channel subscribers can use this bot.</u> 👇",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "JOIN", url: "https://t.me/JackXsparrowxo" },
          { text: "JOIN", url: "https://t.me/JackXsparrowxo" }
        ],
        [
          { text: "JOIN", url: "https://t.me/JackXsparrowxox" }
        ],
        [
          { text: "Joined ✅", callback_data: "/joined" }
        ]
      ]
    }
  });

  // Command: /start
  if (!User.getProperty("isStarte")) {
    // First time user started the bot
    User.setProperty("isStarte", true, "boolean");

    // Increase global user counter
    var totalUser = Bot.getProperty("totalUser", 0);
    totalUser++;
    Bot.setProperty("totalUser", totalUser, "integer");

    // User details
    var name = user.first_name;
    var username = user.username ? "@" + user.username : "(no username)";
    var userid = user.telegramid;

    // Send welcome log to channel
    Api.sendMessage({
      chat_id: "@encorexlog",
      text: "📢 <b>New User started the @encorexosint_bot</b>\n\n" +
            "👤 <b>Name:</b> " + name + "\n" +
            "🔗 <b>Username:</b> " + username + "\n" +
            "🆔 <b>UserID:</b> " + userid + "\n\n" +
            "📊 <b>Total Users:</b> " + totalUser,
      parse_mode: "html",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Bot Link", url: "https://t.me/encorexosint_bot" }]
        ]
      }
    });
  }

  /*CMD
    command: /start
    help: Start command with referral
    need_reply: no
    auto_retry_time: 
    folder: 
    answer: Welcome!
    keyboard: 
    aliases: 
  CMD*/

  if (params) {
    if (params == user.telegramid) {
      Api.sendMessage({
        chat_id: user.telegramid,
        text: "🤧 <i>Do not Use Your Referral Link To earn, Share it with Your Friends!</i>",
        parse_mode: "html",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🙂 Refer",
                url:
                  "https://t.me/share/url?text=https://t.me/" +
                  bot.name +
                  "?start=" +
                  user.telegramid
              }
            ]
          ]
        }
      });
      return;
    }
    if (User.getProperty("sdone") != undefined) {
      Bot.sendMessage("🤧 <i>You Already Started Bot!</i>", "html");
    }
    else {
      User.setProperty("refer_by", params, "string");
      var total_ref = Bot.getProperty("total_ref" + params);
      if (total_ref == undefined) {
        Bot.setProperty("total_ref" + params, 1, "integer");
      } else {
        Bot.setProperty("total_ref" + params, total_ref + 1, "integer");
      }
    }
  }

  var sdone = User.getProperty("sdone");
  if (!sdone) {
    User.setProperty("sdone", "true", "string");
  }

  var welco = User.getProperty("welo");
  if (welco == undefined) {
    var status = Libs.ResourcesLib.anotherChatRes("status", "global");
    status.add(1);
  }
  User.setProperty("welo", user.telegramid, "text");
}

