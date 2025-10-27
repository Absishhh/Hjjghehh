/*CMD
  command: upiinfo_next
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

// ===================== upiinfo_next callback =====================

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

if (isJsonString(content)) {
  var parsed = JSON.parse(content);
  var prettyJson = JSON.stringify(parsed, null, 2);

  var credits = Libs.ResourcesLib.userRes("credits");

  var msg = "💳 *UPI Info Result:*\n\n```json\n" + prettyJson + "\n```\n\n📊 Remaining credits: " + credits.value() + "/50";

  Api.sendMessage({
    chat_id: chat.chatid,
    text: msg,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "🤫 Use Privately", url: "https://t.me/JackXsparrowbot" }],
        [{ text: "➕ Add me to your Group", url: "https://t.me/JackXsparrowbot?startgroup=true" }]
      ]
    }
  });
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ Error: API did not return valid JSON.\nJoin @JackXsparrowxo for updates.",
    reply_to_message_id: request.message_id
  });
}
