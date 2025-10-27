/*CMD
  command: /pak
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

if (chat.chat_type != "group" && chat.chat_type != "supergroup") {
  Bot.sendMessage("❌ This command works only in group. Please use this in our group @JackXsparrowxox.");
  return;
}
  var credits = Libs.ResourcesLib.userRes("credits");

  if (credits.value() < 1) {
    
    var ms = "❌ You don't have any credits, Click below button to get free 1000 credits for today. ✅️";
    Api.sendMessage({
    chat_id: chat.chatid,
    text: ms,
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "👆 Click To Get 1000 Credits", callback_data: "30c" }],[
          { text: "👥️ Use Privately ", url: "https://t.me/JackXsparrowbot?start" }
        ]
      ]
    }
  });   
  }else{

// --- Command logic ---
  // 👉 Actual command action
     var ANumber = params; // User's 10-digit phone number
    var apiUrl = "https://pak-info-1.onrender.com/proxy?number=" + ANumber;
 // Replace with your actual API endpoint

    HTTP.get({
        url: apiUrl,
        success: "/pak1" // Callback command on successful API response
    });

  }
