/*CMD
  command: utr
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: Please send the screenshot of the payment 📃.

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if(!request.photo){
  Bot.sendMessage("⚠️ Please send a valid payment screenshot (image).");
  Bot.runCommand("wait_screenshot");
  return;
}

// Save screenshot file_id
let file_id = request.photo[request.photo.length-1].file_id;
User.setProperty("payment_screenshot", file_id, "string");

Bot.runCommand("wait_utr");

