/*CMD
  command: /getaccess
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

/*CMD
  command: /getaccess
  help: give access with 25h cooldown
  need_reply: false
  auto_retry_time:
  folder: access
CMD*/

var now = Date.now()/1000;

var nextAllowed = User.getProperty("next_access_after");
if(nextAllowed && nextAllowed > now){
  var wait = nextAllowed - now;
  var hours = Math.floor(wait/3600);
  var minutes = Math.floor((wait%3600)/60);

  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "⏳ You can get access again after " + hours + "hours " + minutes + "minutes",
    show_alert: true
  });
  return;
}

// ✅ grant new access
var accessDuration = 24 * 60 * 60; // 24h
var cooldown = 25 * 60 * 60;       // 25h

var until = now + accessDuration;
var nextAccess = now + cooldown;

User.setProperty("access_until", until, "integer");
User.setProperty("next_access_after", nextAccess, "integer");

Api.answerCallbackQuery({
  callback_query_id: request.id,
  text: "✅ You got access for 24 hours!",
  show_alert: true
});

