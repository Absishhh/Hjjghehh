/*CMD
  command: /onReferral
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
  command: /onReferral
  help: Referral handler
  need_reply: no
  auto_retry_time: 
  folder: 
  answer: 
CMD*/

let referrer = options.referrer
if(!referrer){ return }

// prevent self-referral
if(referrer.telegramid == user.telegramid) Bot.sendMessage("Nice Try Diddy") { return }

// ⚠️ make sure this is saved for later
user.referrer_id = referrer.telegramid
user.referral_bonus_given = false

// notify referrer
Bot.sendMessageToChatWithId(
  referrer.telegramid,
  "👤 @" + (user.username ? user.username : user.telegramid) +
  " started the bot through your link.\n" +
  "✅ You will get 1 credit when they join all channels."
)

