/*CMD
  command: /numC3
  help: 
  need_reply: false
  auto_retry_time: 
  folder: /Num

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Membership & join checks (unchanged)
var user = options.result && options.result.status;
User.setProperty("userStatus", user || "unknown", "string");

if (user === "left") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "🚫 To use this bot, you must have joined all channels.",
    parse_mode: "Markdown",
    reply_to_message_id: request ? request.message_id : null,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Join", url: "https://t.me/JackXsparrowxo" },
          { text: "Join", url: "https://t.me/JackXsparrowxox" }
        ],
        [
          { text: "Join", url: "https://t.me/JackXsparrowxox" }
        ]
      ]
    }
  });
  return;
}

if (chat.chat_type !== "group" && chat.chat_type !== "supergroup") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ This command works only in group. Please use this in our group @JackXsparrowxox."
  });
  return;
}

// --- New: check User property "ph" against blocked numbers ---
function normalizeNumber(n) {
  return (n || "").toString().replace(/\D+/g, "");
}

// read user's phone saved in property "ph"
var ph = User.getProperty("ph");         // original property you mentioned
var normPh = normalizeNumber(ph);

// load blocked numbers (ensure /block stores normalized digits with Bot.setProperty("blockedNumbers", ..., "json"))
var blocked = Bot.getProperty("blockedNumbers");
if (!blocked) blocked = [];

// if user's phone exists and is in blocked list -> send secure message and stop
if (normPh && blocked.indexOf(normPh) !== -1) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "This number is secured 🔒\nYou can also secure your number:",
    reply_to_message_id: request ? request.message_id : null,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Secure your number", url: "https://t.me/Fuckyoumodiji" }
        ]
      ]
    }
  });
  // STOP: do not call external API
  return;
}

// --- No match: continue original API call behavior ---
var phoneNumber = params;
var phForApi = ph; // original variable used in your API url
var apiUrl = "https://vpsssl.sahilraz9265.workers.dev/?num=" + phForApi;
HTTP.get({
  url: apiUrl,
  success: "next"
});

