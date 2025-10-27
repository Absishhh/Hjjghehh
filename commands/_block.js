/*CMD
  command: /block
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

// Command: /block

// get command arguments
var arg = params;
if (!arg) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "Usage: /block {number1 number2 ...}\nExample: /block +15551234 7700123456"
  });
  return;
}

// normalize numbers to digits only
function normalizeNumber(n) {
  return (n || "").toString().replace(/\D+/g, "");
}

// split args
var raw = arg.split(/[\s,]+/).filter(function(x){ return x && x.trim(); });

// load blocked list
var blocked = Bot.getProperty("blockedNumbers");
if (!blocked) blocked = [];

var added = [];
var already = [];

for (var i = 0; i < raw.length; i++) {
  var norm = normalizeNumber(raw[i]);
  if (!norm) continue;

  if (blocked.indexOf(norm) === -1) {
    blocked.push(norm);
    added.push(norm);
  } else {
    already.push(norm);
  }
}

// save updated list
Bot.setProperty("blockedNumbers", blocked, "json");

// build reply
var reply = "";
if (added.length) reply += "✅ Added: " + added.join(", ") + "\n";
if (already.length) reply += "ℹ️ Already blocked: " + already.join(", ");
if (!reply) reply = "⚠️ No valid numbers found.";

Api.sendMessage({
  chat_id: chat.chatid,
  text: reply
});

