/*CMD
  command: /Create
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

/* /Create <days> <usersCount> */

if(!params){
  Bot.sendMessage("Usage: /Create <days> <usersCount>\nExample: /Create 10 4");
  return;
}

var parts = params.split(" ");
if(parts.length < 2){
  Bot.sendMessage("Usage: /Create <days> <usersCount>\nExample: /Create 10 4");
  return;
}

var days = parseInt(parts[0]);
var usersCount = parseInt(parts[1]);

if(!days || !usersCount){
  Bot.sendMessage("Invalid parameters");
  return;
}

// generate random code
function randomCode(len){
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var res = "";
  for(var i=0; i<len; i++){
    res += chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return res;
}

var code = randomCode(8);

// save code in Bot property
Bot.setProperty("redeem_"+code, {
  days: days,
  max: usersCount,
  used: 0
}, "json");

Bot.sendMessage(
  "✅ New redeem code created:\n\n`" + code + "`\n\nAccess Days: " + days + 
  "\nUsers allowed: " + usersCount, 
  { parse_mode: "Markdown" }
);

