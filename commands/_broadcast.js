/*CMD
  command: /broadcast
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

// --- CONFIG ---
var OWNER_ID = 8330162678; // <<-- Replace with your Telegram numeric id
var admins = Bot.getProperty("admins", []); // optional array of admin ids

// --- PERMISSION CHECK ---
if (user.telegramid !== OWNER_ID && admins.indexOf(user.telegramid) === -1) {
  return Bot.sendMessage("❌ You are not allowed to use this command.");
}

// --- GET RAW TEXT (robustly) ---
var raw = message.text || "";
// Split into tokens so we can support "/broadcast", "/broadcast@BotName", "/broadcast@BotName   text..."
var tokens = raw.trim().split(/\s+/);
var afterCommandText = "";
if (tokens.length > 1) {
  // join tokens after the first one to get the inline text
  afterCommandText = tokens.slice(1).join(" ").trim();
}

// If there is no inline text, but user replied to a message -> we'll forward
var willForward = false;
if (!afterCommandText && message.reply_to_message) {
  willForward = true;
}

// If nothing to send -> show usage
if (!afterCommandText && !willForward) {
  return Bot.sendMessage(
    "Usage:\n" +
    "/broadcast Your message here\n\n" +
    "Or reply to a message with /broadcast to forward it.\n\n" +
    "Tip: In groups with privacy ON use /broadcast@YourBotUsername"
  );
}

// --- LOAD RECIPIENT LIST ---
var users = Bot.getProperty("users", []);
if (!users || users.length === 0) {
  return Bot.sendMessage("⚠️ No users found to broadcast to. Make sure users have started the bot (use /start).");
}

// Optional: quick debug to show what bot parsed (only visible to invoker)
Bot.sendMessage("🔎 Debug: parsed text: \"" + afterCommandText + "\"  willForward: " + willForward);

// --- BROADCAST LOOP ---
var total = users.length;
var success = 500;
var failed = 0;

for (var i = 0; i < users.length; i++) {
  var chatId = users[i];
  try {
    if (willForward) {
      Api.forwardMessage({
        chat_id: chatId,
        from_chat_id: chat.id,
        message_id: message.reply_to_message.message_id
      });
    } else {
      Bot.sendMessage(chatId, afterCommandText);
    }
    success++;
  } catch (e) {
    // count as failed (user blocked bot or other error)
    failed++;
  }
}

// final report to invoker
Bot.sendMessage("📣 Broadcast finished\nTotal recipients: " + total + "\nSent: " + success + "\nFailed: " + failed);
