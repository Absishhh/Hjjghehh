/*CMD
  command: wait_utr
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: ✅ Screenshot received. Now please enter your payment *UTR number*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if(!message){
  Bot.sendMessage("⚠️ Please enter a valid UTR number:");
  Bot.runCommand("wait_utr");
  return;
}

User.setProperty("payment_utr", message, "string");

let file_id = User.getProperty("payment_screenshot");
let utr = message;
let uid = user.telegramid;

// Channel ID (replace with your channel username or ID, e.g. "@YourPaymentChannel")
let channel = "@JackXsparrow_GC";

Api.sendPhoto({
  chat_id: channel,
  photo: file_id,
  caption: "💳 New Payment Submission\n👤 User ID: " + uid + "\n🔑 UTR: " + utr
});

Bot.sendMessage("✅ Your payment details have been submitted successfully. We will verify soon.");

