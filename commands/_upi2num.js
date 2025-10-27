/*CMD
  command: /upi2num
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

// =================== /upi2num command ===================
// Usage: /upi2num <upi_id>
// Example: /upi2num tushar@fam

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

// read UPI param
var upiId = (params || "").toString().trim().toLowerCase();

// basic validation for UPI ID (simple pattern: word@bank)
if (!upiId || !/^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z]{2,15}$/.test(upiId)) {
  Bot.sendMessage("❌ Invalid UPI ID.\n\nUsage: /upi2num <upi_id>\nExample: /upi2num tushar@fam", {
    reply_to_message_id: request.message_id
  });
  return;
}

// build API URL
var apiUrl = "https://fampay2number.vercel.app/fam?upi_id=" + encodeURIComponent(upiId) + "&key=TrailByDipali";

// call API (do NOT deduct credits here; deduct in success handler)
HTTP.get({
  url: apiUrl,
  success: "upi2num_next",
  error: "upi2num_error"
});
