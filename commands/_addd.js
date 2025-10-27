/*CMD
  command: /addd
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

/*CMD
  command: /addcredit
  help: Admin adds credits to user
  need_reply: yes
  auto_retry_time: 
  folder: 
  answer: Send user Telegram ID and amount. Example:\n`123456789 5`
  keyboard: 
  aliases: 
CMD*/

if(user.telegramid != 7615185463){ // replace with your admin Telegram ID
  Bot.sendMessage("⛔ You are not admin")
  return
}

let parts = message.split(" ")
if(parts.length < 2){
  Bot.sendMessage("⚠️ Wrong format. Example:\n123456789 5")
  return
}

let userId = parseInt(parts[0])
let amount = parseInt(parts[1])

let u = Bot.getUser(userId)
if(!u){
  Bot.sendMessage("User not found")
  return
}

let current = u.balance_credits ? u.balance_credits : 0
u.balance_credits = current + amount

Bot.sendMessage("✅ Added " + amount + " credits to user " + userId)

