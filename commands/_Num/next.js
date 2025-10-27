/*CMD
  command: next
  help: 
  need_reply: false
  auto_retry_time: 
  folder: /Num
  answer:  

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

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

  // if "data" exists, use only that, otherwise use full parsed
  var jsonData = parsed.data ? parsed.data : parsed;

  // pretty-print JSON
  var prettyJson = JSON.stringify(jsonData, null, 2);

  var msg = "📲 Mobile Info Result:\n\n" +
            "```json\n" + prettyJson + "\n```";

  Api.sendMessage({
    chat_id: chat.chatid,
    text: msg,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🤫 Use Privately", url: "https://t.me/JackXsparrowbot" }
        ],
        [
          { text: "➕️ Add me to Your Group", url: "https://t.me/JackXsparrowbot?startgroup=true" }
        ]
      ]
    }
  });

} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ Error: API is not working.\nJoin @JackXsparrowxo for further updates.",
    reply_to_message_id: request.message_id
  });
}

