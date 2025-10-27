/*CMD
  command: /numC1
  help: 
  need_reply: false
  auto_retry_time: 
  folder: /Num

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var status = options.result.status

if ((status == "member") | (status == "administrator") | (status == "creator") | (status == "subscriber")) {
  User.setProperty("userStatus", status, "string")

  let channel = "@JackXsparrowxo"
  let id = user.telegramid   // ✅ user is system object here, not overwritten

  Api.getChatMember({
    chat_id: channel,
    user_id: id,
    on_result: "/numC2"
  })
}

if (status == "left") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "🚫 To use this bot, you must have joined all channels.",
    parse_mode: "Markdown",
    reply_to_message_id: request ? request.message_id : null,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Join", url: "https://t.me/https://t.me/JackXsparrowbot?startgroup=true" " },
          { text: "Join", url: "https://t.me/JackXsparrowxox" }
        ],
        [
          { text: "Join", url: "https://t.me/JackXsparrowxox" }
        ]
      ]
    }
  });
}

