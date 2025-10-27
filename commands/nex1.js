/*CMD
  command: nex1
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
  var dataArr;

  // Response is directly an array
  if (parsed.length) {
    dataArr = parsed;
  } else if (parsed.data) {
    dataArr = parsed.data;
  }

  if (dataArr && dataArr.length > 0) {
    for (var i = 0; i < dataArr.length; i++) {
      var d = dataArr[i];
      // Helper function to get today's date in IST
  


      var msg = "-- Result " + (i + 1) + " --\n=============\n📱 MOBILE INFORMATION\n===============\n";
      msg += "📛 Name: " + (d.name || "N/A") + "\n";
      msg += "👨 Father Name: " + (d.father_name || "N/A") + "\n";  // fixed key
      msg += "🏠 Address: " + (d.address || "N/A") + "\n";
      msg += "📱 Number: " + (d.mobile || "N/A") + "\n";
      msg += "📞 Alternative Number: " + (d.alt_mobile || "N/A") + "\n"; // fixed key
      msg += "🌐 Circle: " + (d.circle || "N/A") + "\n";
      msg += "🆔 Aadhar/Pan Number: " + (d.id_number || "N/A") + "\n";   // fixed key
      msg += "📧 Email: `" + (d.email ? d.email : "N/A") + "`\n";

      Api.sendMessage({
        chat_id: chat.chatid,
        text: msg,
        parse_mode: "Markdown",
        reply_to_message_id: request.message_id,
        reply_markup: {
          inline_keyboard: [
            [{ text: "< Back", callback_data: "menu2" }],
            [{ text: "⌚ Check Your Access Time", callback_data: "acs" }]
          ]
        }
      });
    }
  } else {
    Bot.sendMessage("⚠️ There is no data available of this Number!!");
  }
} else {
  Bot.sendMessage("⚠️ Error: API is not working.\n Join @JackXsparrowxo for further updates.");
}

