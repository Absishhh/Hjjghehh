/*CMD
  command: /upiinfo
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

// ===================== /upiinfo command =====================

// Restrict command to groups only
if (chat.chat_type != "group" && chat.chat_type != "supergroup") {
  Bot.sendMessage("❌ This command works only in group.\nUse in our group @JackXsparrowxox.");
  return;
}

// Load user credits
var credits = Libs.ResourcesLib.userRes("credits");

// Check credits
if (credits.value() < 1) {
  var ms = "❌ You don't have any credits.\nClick below button to get free 50 credits for today ✅";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: ms,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👆 Get Free 50 Credits", callback_data: "30c" }],
        [{ text: "🤫 Use Privately", url: "https://t.me/encorexosint_bot?start" }]
      ]
    }
  });
  return;
}

// --- Command Logic ---

var upiId = params; // user input after /upiinfo
if (!upiId || upiId.indexOf("@") === -1) {
  Bot.sendMessage("❌ Invalid UPI ID.\n\nUsage: /upiinfo <upi_id>\nExample: /upiinfo 8733896886@ybl", {
    reply_to_message_id: request.message_id
  });
  return;
}

// API endpoint
var apiUrl = "https://upi-info.vercel.app/api/upi?key=456&upi_id=" + encodeURIComponent(upiId);

// Deduct 1 credit now
credits.add(-1);

// Call API
HTTP.get({
  url: apiUrl,
  success: "upiinfo_next"
});
