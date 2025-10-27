/*CMD
  command: /give
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
  command: /give
  help: admin: give access to any user in days, usage: /give userId days
  need_reply: false
  auto_retry_time:
  folder: admin
CMD*/

var admins = [8330162678,5388393253]; // <-- replace with your Telegram id(s)
if(!admins.includes(user.telegramid)){
  Bot.sendMessage("⛔ You are not allowed to use this command.");
  return;
}

var parts = message.split(" ");
if(parts.length < 3){
  Bot.sendMessage("❗ Usage: /give userId days\nExample: /give 123456789 7");
  return;
}

var targetId = parseInt(parts[1]);
var days = parseInt(parts[2]);

if(isNaN(targetId) || isNaN(days) || days <= -1){
  Bot.sendMessage("⚠️ Invalid format. Try: /give 123456789 7");
  return;
}

var now = Math.floor(Date.now()/1000);
var until = now + (days * 24 * 60 * 60);

// Save to bot-wide storage so the target user and /maincommand can read it
Bot.setProperty("access_until_" + targetId, until, "integer");

// also set next_access_after to now so they can use immediately (or you can set other cooldown logic)
Bot.setProperty("next_access_after_" + targetId, now, "integer");

// Confirm to admin
Bot.sendMessage("✅ Access granted!\nUser " + targetId + " now has access for " + days + " day(s).");

// Optional: notify the target user
try {
  Api.sendMessage({
    chat_id: targetId,
    text: "✅ Admin granted you " + days + " day(s) access. You can now use the bot."
  });
} catch(e) {
  // user might have blocked the bot => ignore
}

