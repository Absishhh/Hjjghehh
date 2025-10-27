/*CMD
  command: /aadhar
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

// /aadhar command
if (chat.chat_type != "group" && chat.chat_type != "supergroup") {
  Bot.sendMessage("❌ This command works only in group. Please use this in our group @JackXsparrowxox.");
  return;
}

var credits = Libs.ResourcesLib.userRes("credits");

// Pre-check credits to avoid spam
if (credits.value() < 1) {
  var ms = "❌ You don't have any credits, Click below button to get free 1000 credits for today. ✅️";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: ms,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👆 Click To Get 1000 Credits", callback_data: "30c" }],
        [{ text: "👥️ Use Privately ", url: "https://t.me/JackXsparrowbot?start" }]
      ]
    }
  });
  return;
}

// Validate Aadhar input (12 digits)
var aadhar = params

// Build API URL
var apiUrl = "https://aadhar.xseller.me/LUND?id=" + aadhar;


// Call API with browser-like headers (some platforms accept headers in HTTP.get)
try {
  HTTP.get({
    url: apiUrl,
    success: "adresponse",
    error: "anext_error"
  });
} catch (e) {
  // Some Bot platforms do not support headers in HTTP.get — fall back to simple call without headers
  HTTP.get({
    url: apiUrl,
    success: "adresponse",
    error: "anext_error"
  });
}
