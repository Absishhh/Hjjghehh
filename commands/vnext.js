/*CMD
  command: vnext
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

// vnext with null → "NA" replacement
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// helper: recursively replace null values with "NA"
function replaceNulls(obj) {
  if (obj === null) return "NA";
  if (Array.isArray(obj)) return obj.map(replaceNulls);
  if (typeof obj === "object") {
    var out = {};
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      out[k] = replaceNulls(obj[k]);
    }
    return out;
  }
  return obj;
}

if (!isJsonString(content)) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ Error: API response is not valid JSON or API is not working.",
    reply_to_message_id: request.message_id
  });
  return;
}

var parsed = JSON.parse(content);

// If API returned literal JSON `null` or not an object
if (parsed === null || typeof parsed !== "object") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "ℹ️ No data found for that vehicle number (API returned null).",
    reply_to_message_id: request.message_id
  });
  return; // don't deduct credits
}

// change ONLY api owner name
parsed.owner = "@frappeash";

// replace nulls with "NA"
parsed = replaceNulls(parsed);

var credits = Libs.ResourcesLib.userRes("credits");

// ensure user still has credits
if (credits.value() < 1) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ You don't have enough credits to perform this lookup.",
    reply_to_message_id: request.message_id
  });
  return;
}

credits.add(-1); // deduct 1 credit

var prettyJson = JSON.stringify(parsed, null, 2);

var msg = "```json\n" + prettyJson + "\n```\n\n📊 Your remaining credits: " + credits.value() + "/50";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "Markdown",
  reply_to_message_id: request.message_id,
  reply_markup: {
    inline_keyboard: [
      [{ text: "🤫 Use Privately", url: "https://t.me/encorexosint_bot" }],
      [{ text: "➕️ Add me to Your Group", url: "https://t.me/encorexosint_bot?startgroup=true" }]
    ]
  }
});
