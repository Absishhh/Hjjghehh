/*CMD
  command: check3
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

var user = options.result.status
if ((user == "member") | (user == "administrator") | (user == "creator") |
(user == "subscriber") ) {
  User.setProperty("userStatus", user, "string")
  Bot.runCommand("menu2")
}

if (user == "left") {
  Bot.sendMessage("*❌ Must Join All Channel*")
 
}
