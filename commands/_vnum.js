/*CMD
  command: /vnum
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

// /vnum command (vehicle number lookup)
if (chat.chat_type != "group" && chat.chat_type != "supergroup") {
  Bot.sendMessage("❌ This command works only in group. Please use this in our group @JackXsparrowxox.");
  return;
}

var credits = Libs.ResourcesLib.userRes("credits");

if (credits.value() < 1) {
  var ms = "❌ You don't have any credits, Click below button to get free 50 credits for today. ✅️";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: ms,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👆 Click To Get 50 Credits", callback_data: "30c" }],
        [{ text: "👥️ Use Privately ", url: "https://t.me/encorexosint_bot?start" }]
      ]
    }
  });
  return;
} else {

  // --- /vnum Command logic ---
  var vnum = (params || "").toString().trim().toUpperCase();

  // Basic validation for common Indian vehicle number formats (e.g. UP78AW9775, MH12AB1234)
  // This regex allows: 2 letters, 1-2 digits, 1-2 letters, 1-4 digits (case-insensitive)
  var vnumPattern = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{1,4}$/i;

  if (!vnum || !vnumPattern.test(vnum)) {
    Bot.sendMessage(
      "❌ Invalid vehicle number.\n\nUsage: /vnum <vehicle-number>\nExample: /vnum UP78AW9775  OR  /vnum MH 12 AB 1234",
      { reply_to_message_id: request.message_id }
    );
    return;
  }

  // Normalize (remove spaces) because API likely expects compact RC e.g. UP78AW9775
  var normalizedVnum = vnum.replace(/\s+/g, "");

  // API endpoint for vehicle info (rc-info-ng)
  var apiUrl = "https://rc-info-ng.vercel.app/?rc=" + encodeURIComponent(normalizedVnum);

  // Optionally deduct 1 credit here if your flow requires it (uncomment to deduct)
  // credits.add(-1);

  HTTP.get({
    url: apiUrl,
    success: "vnext" // Callback command on successful API response
  });
}
