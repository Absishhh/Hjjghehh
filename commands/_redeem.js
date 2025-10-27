/*CMD
  command: /redeem
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: Send the redeem code recieved from admin! 👇

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* /redeem */


  var code = message;
  var data = Bot.getProperty("redeem_"+code);

  if(!data){
    Bot.sendMessage("❌ Invalid code");
    return;
  }

  if(data.used >= data.max){
    Bot.sendMessage("❌ This code has reached its maximum usage limit");
    return;
  }

  // check if user already redeemed
  var already = User.getProperty("redeemed_"+code);
  if(already){
    Bot.sendMessage("❌ You already redeemed this code");
    return;
  }

  // extend access
  var now = Math.floor(Date.now()/1000);
  var extra = data.days * 24 * 60 * 60;

  var untilUser = User.getProperty("access_until");
  var untilBot = Bot.getProperty("access_until_" + user.telegramid);

  var currentUntil = 0;
  if(untilUser && untilBot){
    currentUntil = Math.max(parseInt(untilUser), parseInt(untilBot));
  }else if(untilUser){
    currentUntil = parseInt(untilUser);
  }else if(untilBot){
    currentUntil = parseInt(untilBot);
  }

  if(!currentUntil || currentUntil < now){
    currentUntil = now;
  }

  var newUntil = currentUntil + extra;

  // save access
  User.setProperty("access_until", newUntil, "integer");
  Bot.setProperty("access_until_" + user.telegramid, newUntil, "integer");

  // mark redeem usage
  data.used++;
  Bot.setProperty("redeem_"+code, data, "json");
  User.setProperty("redeemed_"+code, true, "boolean");

  var remaining = newUntil - now;
  var days = Math.floor(remaining/86400);
  var hours = Math.floor((remaining%86400)/3600);

  Bot.sendMessage("✅ Code redeemed successfully!\n\nAccess extended by " + data.days + " days.\nYour new access: " + days + " days " + hours + " hours.");


