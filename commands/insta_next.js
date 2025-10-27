/*CMD
  command: insta_next
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

// =================== insta_next (HTTP.get success handler) ===================

function isJsonString(str) {
  try { JSON.parse(str); return true; } catch (e) { return false; }
}

if (!content) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ API returned an empty response. Try again later.",
    reply_to_message_id: request.message_id
  });
  return;
}

if (!isJsonString(content)) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ API did not return valid JSON. Try again later.",
    reply_to_message_id: request.message_id
  });
  return;
}

var data = JSON.parse(content);

// If API indicates no data
// (adjust checks if your API returns a different “not found” shape)
if (!data || (data && Object.keys(data).length === 0) || data.error || data.message === "Not Found") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ There is no data available for this Instagram username!!",
    reply_to_message_id: request.message_id
  });
  return;
}

// Deduct 1 credit now (only on success)
var credits = Libs.ResourcesLib.userRes("credits");
if (credits.value() < 1) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ You don't have enough credits.",
    reply_to_message_id: request.message_id
  });
  return;
}
credits.add(-1);

// Pretty-print JSON and escape for HTML <pre>
var pretty = JSON.stringify(data, null, 2);
var escaped = pretty.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

var msg =
  "<b>📸 Instagram Profile (JSON)</b>\n\n" +
  "<pre>" + escaped + "</pre>\n\n" +
  "📊 <b>Your remaining credits:</b> " + credits.value() + "/1000";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "HTML",
  reply_to_message_id: request.message_id,
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Back to Menu", callback_data: "menu_back" }],
      [{ text: "➕ Add me to your Group", url: "https://t.me/JackXsparrowbot?startgroup=true" }]
    ]
  }
});
