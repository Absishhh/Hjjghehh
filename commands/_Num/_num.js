/*CMD
  command: /num
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

let stat = Bot.getProperty(""+user.telegramid+"?Ban");
if (stat=="ban"){
  Bot.sendMessage("*You're Banned From Using The Bot ❌*");
}else{
User.setProperty("ph", params, "string");

  let channel = "@JackXsparrowxo";
  //let channel = "@Pro_to_Nooob";
  let id = user.telegramid;
  Api.getChatMember({ 
    chat_id : channel,
    user_id : id,
    on_result :"/numC1"
  })
}
