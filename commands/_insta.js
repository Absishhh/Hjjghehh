/*CMD
  command: /insta
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

// =================== /insta command ===================
// Usage: /insta <instagram_username>
// Example: /insta meta

// allow in group OR private
if (chat.chat_type != "group" && chat.chat_type != "supergroup" && chat.chat_type != "private") {
  Bot.sendMessage("❌ This command works only in group or in private chat.\nUse in our group @JackXsparrow_GC or DM me privately.");
  return;
}

// credits resource
var credits = Libs.ResourcesLib.userRes("credits");

// check credits
if (credits.value() < 1) {
  var ms = "❌ You don't have any credits.\nClick below button to get free 1000 credits for today. ✅️";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: ms,
    parse_mode: "HTML",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👆 Click To Get 1000 Credits", callback_data: "30c" }],
        [{ text: "🔙 Back to Menu", callback_data: "menu_back" }]
      ]
    }
  });
  return;
}

// read username param
var username = (params || "").toString().trim().toLowerCase();

// basic validation for Instagram username (letters, numbers, dot, underscore, up to 30 chars)
if (!username || !/^[A-Za-z0-9._]{1,30}$/.test(username)) {
  Bot.sendMessage("❌ Invalid Instagram username.\n\nUsage: /insta <username>\nExample: /insta meta", {
    reply_to_message_id: request.message_id
  });
  return;
}

// build API URL
var apiUrl = "https://insta-profile-info-api.vercel.app/api/instagram.php?username=" + encodeURIComponent(username);

// call API (do NOT deduct credits here; deduct in success handler)
HTTP.get({
  url: apiUrl,
  success: "insta_next",
  error: "insta_error"
});
