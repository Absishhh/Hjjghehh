/*CMD
  command: upi2num_next
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

// =================== /upi2num success handler (JSON) ===================
function upi2num_next(response) {
  var data;
  try {
    data = JSON.parse(response.body);
  } catch (e) {
    Bot.sendMessage("⚠️ Failed to parse server response. Please try again later.");
    return;
  }

  // if API returns error
  if (!data || data.error) {
    Bot.sendMessage("❌ No details found for this UPI ID.");
    return;
  }

  // deduct 1 credit after successful result
  var credits = Libs.ResourcesLib.userRes("credits");
  credits.add(-1);

  // Send raw JSON (formatted)
  var jsonOutput = JSON.stringify(data, null, 2);

  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<b>✅ UPI Lookup Result (JSON)</b>\n\n<pre>" + jsonOutput + "</pre>",
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id
  });
}

// =================== /upi2num error handler (JSON) ===================
function upi2num_error() {
  Bot.sendMessage("❌ API Error: Unable to fetch details right now. Please try again later.");
}
