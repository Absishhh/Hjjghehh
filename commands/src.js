/*CMD
  command: src
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

// ---- access check snippet ----
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
// ---- end of access check ----

Api.editMessageCaption({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
    caption: "*🔥 Here are the available services 👇*\n\n_⚠ You can use unlimited times until your access period ends_",
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: [[{ text: "📱 Number To Information", callback_data: "num" }],
      [{ text: "🚗 Vehicle No. To Information", callback_data: "vnum" }],
      [{ text: "📃 GST no. To Information", callback_data: "Vgst" }],[{ text: "💳 UPI To Information", callback_data: "menu_upi" }],
      [{ text: "< Back", callback_data: "menu2" }]] }
  })
