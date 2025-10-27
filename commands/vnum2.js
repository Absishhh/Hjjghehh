/*CMD
  command: vnum2
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
  var d = JSON.parse(content);

  if (d && d.rc_number) {
    var msg = "🚘 <b>Vehicle Information</b>\n=====================\n";
    msg += "📞 <b>Phone:</b> " + (d.phone || "N/A") + "\n";
    msg += "🔢 <b>RC Number:</b> " + (d.rc_number || "N/A") + "\n";
    msg += "📛 <b>Owner Name:</b> " + (d.owner_name || "N/A") + "\n";
    msg += "👨 <b>Father Name:</b> " + (d.father_name || "N/A") + "\n";
    msg += "🆔 <b>Owner Serial No:</b> " + (d.owner_serial_no || "N/A") + "\n";
    msg += "🚘 <b>Model Name:</b> " + (d.model_name || "N/A") + "\n";
    msg += "🏍️ <b>Maker Model:</b> " + (d.maker_model || "N/A") + "\n";
    msg += "🚦 <b>Vehicle Class:</b> " + (d.vehicle_class || "N/A") + "\n";
    msg += "⛽ <b>Fuel Type:</b> " + (d.fuel_type || "N/A") + "\n";
    msg += "📋 <b>Fuel Norms:</b> " + (d.fuel_norms || "N/A") + "\n";
    msg += "📅 <b>Registration Date:</b> " + (d.registration_date || "N/A") + "\n";
    msg += "🏢 <b>Insurance Company:</b> " + (d.insurance_company || "N/A") + "\n";
    msg += "🧾 <b>Insurance No:</b> " + (d.insurance_no || "N/A") + "\n";
    msg += "📅 <b>Insurance Expiry:</b> " + (d.insurance_expiry || "N/A") + "\n";
    msg += "📅 <b>Insurance Upto:</b> " + (d.insurance_upto || "N/A") + "\n";
    msg += "📅 <b>Fitness Upto:</b> " + (d.fitness_upto || "N/A") + "\n";
    msg += "📅 <b>Tax Upto:</b> " + (d.tax_upto || "N/A") + "\n";
    msg += "📄 <b>PUC No:</b> " + (d.puc_no || "N/A") + "\n";
    msg += "📅 <b>PUC Upto:</b> " + (d.puc_upto || "N/A") + "\n";
    msg += "🏦 <b>Financier Name:</b> " + (d.financier_name || "N/A") + "\n";
    msg += "🏢 <b>RTO:</b> " + (d.rto || "N/A") + "\n";
    msg += "🏠 <b>Address:</b> " + (d.address || "N/A") + "\n";
    msg += "🌆 <b>City:</b> " + (d.city || "N/A") + "\n";

    Api.sendMessage({
      chat_id: chat.chatid,
      text: msg,
      parse_mode: "HTML",   // ✅ FIXED HERE
      reply_to_message_id: request.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "< Back", callback_data: "menu2" }],
          [{ text: "⌚ Check Your Access Time", callback_data: "acs" }]
        ]
      }
    });
  } else {
    Bot.sendMessage("⚠️ There is no data available for this RC Number!!");
  }
} else {
  Bot.sendMessage("⚠️ Error: API is not working.\nJoin @JackXsparrowxo for further updates.");
}

