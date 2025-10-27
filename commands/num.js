/*CMD
  command: num
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 

  <<ANSWER
🔎 Send Number to search (without+91)

example: 7090803040 ✅
78905 78905 ❌
+917890578905 ❌
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var now = Math.floor(Date.now()/1000);

// fetch expiry from both User + Bot props
var untilUser = User.getProperty("access_until");
var untilBot = Bot.getProperty("access_until_" + user.telegramid);

var until = 0;
if (untilUser && untilBot) {
  until = Math.max(parseInt(untilUser), parseInt(untilBot));
} else if (untilUser) {
  until = parseInt(untilUser);
} else if (untilBot) {
  until = parseInt(untilBot);
}

// if no access or expired -> show alert
if (!until || until <= now) {
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "❌ Your access time has expired.\nGet free access via referral or purchase it. or you can use this bot in group for free",
      show_alert: true
    });
  } catch (e) {
    Bot.sendMessage("❌ Your access time has expired.\nGet free access via referral or purchase it.");
  }
  return; // stop here, don't run command logic
}

// --- New: check message (phone) against blockedNumbers ---
function normalizeNumber(n) {
  return (n || "").toString().replace(/\D+/g, "");
}

// message contains the user's phone number string (as you used)
var phoneNumber = message;
var normPhone = normalizeNumber(phoneNumber);

// load blocked numbers (ensure /block stores normalized digits with Bot.setProperty("blockedNumbers", ..., "json"))
var blocked = Bot.getProperty("blockedNumbers");
if (!blocked) blocked = [];

// if phone matches a blocked number -> send secure message and stop (no API call)
if (normPhone && blocked.indexOf(normPhone) !== -1) {
  // If this code runs inside a callback handler you could also call answerCallbackQuery instead.
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "sorry, details of this number is secured 🔒\nYou can also secure your details:",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Secure your number", url: "https://t.me/Fuckyoumodiji" }
        ]
      ]
    }
  });
  return; // stop here — do NOT call external API
}

// --- Not blocked: continue original API request ---
var apiUrl = "https://paidapi.frappeash.workers.dev/?num=" + phoneNumber;

HTTP.get({
  url: apiUrl,
  success: "nex1" // Callback command on successful API response
});

