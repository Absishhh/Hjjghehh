/*CMD
  command: Vgst
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

var now = Math.floor(Date.now()/1000);

// fetch expiry from both User + Bot props
var untilUser = User.getProperty("access_until");
var untilBot = Bot.getProperty("access_until_" + user.telegramid);

var until = 0;
if(untilUser && untilBot){
  until = Math.max(parseInt(untilUser), parseInt(untilBot));
}else if(untilUser){
  until = parseInt(untilUser);
}else if(untilBot){
  until = parseInt(untilBot);
}

// if no access or expired -> show alert
if(!until || until <= now){
  try{
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "❌ Your access time has expired.\nGet free access via referral or purchase it.",
      show_alert: true
    });
  }catch(e){
    Bot.sendMessage("❌ Your access time has expired.\nGet free access via referral or purchase it.");
  }
  return; // stop here, don't run command logic
}
Bot.runCommand("gst") 
