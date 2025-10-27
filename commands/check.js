/*CMD
  command: check
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

var status = options.result.status

if ((status == "member") | (status == "administrator") | (status == "creator") | (status == "subscriber")) {
  User.setProperty("userStatus", status, "string")

  let channel = "@JackXsparrowxo"
  let id = user.telegramid   // ✅ user is system object here, not overwritten

  Api.getChatMember({
    chat_id: channel,
    user_id: id,
    on_result: "check2"
  })
}

if (status == "left") {
  Bot.sendMessage("*❌ Must Join All Channel*")
}

