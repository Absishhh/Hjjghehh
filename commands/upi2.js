/*CMD
  command: upi2
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

// ---------------- menu_upiinfo2 (HTTP success) ----------------
function isJsonString(str) {
  try { JSON.parse(str); return true; } catch (e) { return false; }
}

if (!isJsonString(content)) {
  // clear pending and notify
  User.setProperty("upi_pending", false);
  Api.sendMessage({ chat_id: chat.chatid, text: "⚠️ API did not return valid JSON. Try again later.", reply_to_message_id: request.message_id });
  return;
}

var d = JSON.parse(content);

// If API indicates no data, send single message
if (!d || !d.upi_id) {
  User.setProperty("upi_pending", false); // clear pending
  Api.sendMessage({ chat_id: chat.chatid, text: "⚠️ There is no data available for this UPI ID!!", reply_to_message_id: request.message_id });
  return;
}

// success: deduct credit now
var credits = Libs.ResourcesLib.userRes("credits");
if (credits.value() < 1) {
  User.setProperty("upi_pending", false);
  Api.sendMessage({ chat_id: chat.chatid, text: "❌ You don't have enough credits.", reply_to_message_id: request.message_id });
  return;
}
credits.add(-1);
User.setProperty("upi_pending", false); // clear pending

// format result (nice HTML)
var msg = "💳 <b>UPI Information</b>\n=====================\n";
msg += "🆔 <b>UPI ID:</b> " + (d.upi_id || "N/A") + "\n";
msg += "👤 <b>Name:</b> " + (d.name || "N/A") + "\n";
msg += "🏦 <b>Bank:</b> " + (d.bank || "N/A") + "\n";
msg += "📱 <b>Verified:</b> " + ((d.verified === true || d.verified == "true") ? "✅ Yes" : "❌ No") + "\n";
msg += "📅 <b>Checked At:</b> " + (d.checked_at || "N/A") + "\n";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "HTML",
  reply_to_message_id: request.message_id,
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Back to Menu", callback_data: "menu_back" }],
      [{ text: "⌚ Check Your Access Time", callback_data: "acs" }]
    ]
  }
});
