/*CMD
  command: 30c
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

var credits = Libs.ResourcesLib.userRes("credits");

// get Indian date (yyyy-mm-dd)
function getIndianDate() {
  var now = new Date();
  var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  var ist = new Date(utc + (3600000*5.5)); // IST = UTC+5:30
  return ist.getFullYear() + "-" + (ist.getMonth()+1) + "-" + ist.getDate();
}

var today = getIndianDate();
var lastClaim = User.getProperty("lastClaim");

if(lastClaim == today){
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "⚠️ You have already claimed 1000 Credits Today!, You can again claim 1000 credits tomorrow!\nWait till tomorrow 😊",
    show_alert: true
  });
}else{
  credits.set(1000); // always reset to 1000
  User.setProperty("lastClaim", today, "string");
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "✅ You got 1000 credits successfully!",
    show_alert: true
  });
}

