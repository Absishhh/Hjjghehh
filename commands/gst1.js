/*CMD
  command: gst1
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

  // pretty-print JSON
  var prettyJson = JSON.stringify(parsed, null, 2);
  var dataObj = parsed.data;
if (dataObj) {
 // Helper function to get today's date in IST
var credits = Libs.ResourcesLib.userRes("credits");
credits.add(-1)
  var msg = "📊 GST INFORMATION\n";
    msg += "=====================\n";
    msg += "🆔 GSTIN: " + (dataObj.Gstin || "N/A") + "\n";
    msg += "🏢 Trade Name: " + (dataObj.TradeName || "N/A") + "\n";
    msg += "⚖️ Legal Name: " + (dataObj.LegalName || "N/A") + "\n";
    msg += "🏠 Address: " + 
            (dataObj.AddrBno || "") + ", " + 
            (dataObj.AddrFlno || "") + ", " + 
            (dataObj.AddrSt || "") + ", " + 
            (dataObj.AddrLoc || "") + "\n";
    msg += "🌐 State Code: " + (dataObj.StateCode || "N/A") + "\n";
    msg += "📮 Pincode: " + (dataObj.AddrPncd || "N/A") + "\n";
    msg += "💼 Taxpayer Type: " + (dataObj.TxpType || "N/A") + "\n";
    msg += "📊 Status: " + (dataObj.Status || "N/A") + "\n";
    msg += "🚫 Block Status: " + (dataObj.BlkStatus || "N/A") + "\n";
    msg += "📅 Date of Registration: " + (dataObj.DtReg || "N/A") + "\n";
    msg += "📅 Date of Deregistration: " + (dataObj.DtDReg || "N/A") + "\n\n📊 Your remaining credits: " + credits.value() + "/30";


  Api.sendMessage({
    chat_id: chat.chatid,
    text: msg,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🤫 Use Privately", url: "https://t.me/JackXsparrowbot" }],[
          { text: "➕️ Add me to Your Group", url: "https://t.me/JackXsparrowxo?startgroup=true" }
        ]
      ]
    }
  });
  } else {
    Bot.sendMessage("⚠️ There is not data available for this GST number.");
  }
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ Error: API is not working.\n Join @A1BlackHats for further updates.",
    reply_to_message_id: request.message_id
  });
}

