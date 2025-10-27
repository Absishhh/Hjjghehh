/*CMD
  command: menu
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

/* Command: /menu */
if(!Bot.getProperty("user_" + user.telegramid)){
  // give 2 free credits
  var balance = Libs.ResourcesLib.userRes("balance");
  balance.add(5);

  // mark user as registered
  Bot.setProperty("user_" + user.telegramid, true, "boolean");

  Bot.sendMessage("🎉 Welcome " + user.first_name + "!\n" +
                  "You received *5 free credits*🎁\n",
                  {parse_mode: "Markdown"});
}
let refUser = User.getProperty("refer_by")
if (refUser) {
  var balance = Libs.ResourcesLib.anotherUserRes("balance", refUser)
  balance.add(1)
  var total_ref = Bot.getProperty("total_ref" + refUser)
  Api.sendMessage({
    chat_id: refUser,
    text: "➕ *New User Attracted by Your Referral link*\n\n🙋 *User : @"+user.username+"*\n\n➕ *Amount :* 1 Point Added to Balance",
    parse_mode: "Markdown"
  })
  User.setProperty("refer_by", null)
}
var balance = Libs.ResourcesLib.userRes("balance")
Api.sendPhoto({
  photo: "https://ibb.co/6d86df6",  // replace with your image link
  caption: "Your Credits = " + balance.value() +" \n\n 1 Number details will deduct your 1 Credit 👇",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🔥 Number to Information", callback_data: "num" }
      ],
      [
        { text: "👥️ Get Free Credits", callback_data: "bal" }
      ]
    ]
  },
  on_result: "/p"   // callback after sending photo
});
/*CMD
  command: /menu
  help: Main menu
  need_reply: no
  auto_retry_time: 
  folder: 
  answer: 📋 Main Menu
  keyboard: 
  aliases: 
CMD*/


