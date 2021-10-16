# 2.1.0
> ## commands:
> - added `search`: search directly on discord pages of google, wikipedia or github! `help search` for more informations
> ## bugs:
> - `changelog list` command: too many version for an embed
> - `settings list` & `settings get` now require MANAGE_GUILD permission to use it
> ## website:
> - you can now access to your dashboard directly from the main domain! `http://jemibou.tk`
> - fixed minor bugs and improuving performances
> ## more:
> - updated `readme.md`

---

# 2.0.2
> ## bugs:
> - error on big user/role datas with the infos command
> - error on same command when a guild has a banner
> ## website:
> - fixing of minor bugs
> - commands' table improuvements
> - changelog is now inside the footer

---

# 2.0.1
> ## website:
> - You can now view and set bot's variable into your dashboard's settings!
> - Changed some element disposition because of feedback
> - The green color has been replaced by the famous discord blur color

---

# 2.0.0
> ## commands:
> - `dashboard`: new command that send you a link to your guild's dashboard.
> ## website:
> - Better dashboard display (better that better)
> - Removed settings displayer on the website

---

# 1.9.0
> ## commands:
> - `avatar`: now the picture is in png if it's not dynamic.
> ## website:
> - You can now change each bot's setting directly from the dashboard. Go on jemibou.tk/dashboard !
> - Changed dashboard display for smaller screen size

---

# 1.8.1
> ## website:
> - improuved dashboard performances & add specific url to go on your dashboard without pass by your server list (http://jemibou.tk/dashboard?guild=YOUR_GUILD_ID) !

---

# 1.8.0
> ## website (biggest update):
> - Now the website has a dashboard! see http://jemibou.tk/dashboard !
> ## soon:
> - i've improuved the settings system to made easier than now! stay informed :)

---

# 1.7.1
> ## commands:
> - `pool` Error of language: now renamed on "poll" + you can now use discord markdown in your questions
> - `translate` Now doesn't require extra perms
> - `clear` when this command returns an error: you can now delete this error by clicking on the reaction
> ## bugs:
> - Now the support discord link is working
> - fixing some other minor bugs
> ## website:
> - The description is now in english

---

# 1.7.0
> ## commands:
> - `translate` Translate a text to a specific language!
> - `game` Added 2 games: the coin game & the wikipedia game!
> ## bugs:
> - `annonce` (only for bot owners) block the command if there isn't any message!
> - In the support server, the status message will no longer spam: the message will be edited
> ## website:
> - fixed some major bugs
> - re-passed the website on http because of bugs (i still working on making a secure website)
> ## improuvement:
> - I made a lot of little improuvement for a better code & a better bot ;)

---

# 1.6.2
> ## commands:
> - `customfont` gets new fonts!
> ## bugs:
> - Website is now working
> - Minor bug fixed

---

# 1.6.0
> ## bot:
> - Now the bot can't ping @everyone
> ## bugs/changes:
> - `pool` arguments changed (use `.h pool` for more informations)
> ## website:
> - The website is now online: check it [here](http://jemibou.tk)!

---

# 1.5.2
> ## commands:
> - `infos server` doesn't longer require extra perms
> - `pool` command added
> ## infos:
> - The website will be public soon: i just need to make it secure & fix 2/3 bugs :)

---

# 1.5.0
> ## commands:
> - font: get custom font for your discord channels!
> - `settings get`: doesn't require extra perm
> ## bugs:
> - `infos user`: command error if the user is a bot
> - `settings set`: now require `MANAGE_GUILD`permission
> ## features:
> - `links`: rovelstars link added

---

# 1.4.2
> ## sorry:
> - 1.4.1 was the buggest version of jemibou :(
> ## bugs:
> - get parameter in-server errors
> - `invite`: send now the correct invitation link
> - `joinMessageIfBot` & `leaveMessageIfBot` now are working
> - fixed many other bugs

---

# 1.4.1
> ## new settings features:
> - New settings, settings notation & settings variables (`settings list` for more informations)
> ## bugs:
> - fixed some minor bugs

---

# 1.4.0
> ## commands:
> - `game` (only for beta users) play some games with the bot (for now there is just the `chifumie`game (= rock paper scissors))
> ## bugs:
> - display error with the `infos server` (for emojis)
> - `infos server`: channels aren't in order (same for the roles)
> - fixed minor bugs
> ## features:
> - `infos user` & `infos channel` are now free but `infos role` require now a `vip`rank and `infos server` require a `vip+` rank
> - `infos server` now display the server icon in the large image area
> - `infos user` now display the tag and the nickname (if there is one)
> - beta system
> ## soon:
> - More settings options

---

# 1.3.3
> ## commands:
> - `invite` give you the invite link of a bot
> ## bugs:
> - fixed minor bugs
> ## features:
> - Now show in `help` command if a command is premium

---

# 1.3.2
> ## commands:
> - `infos user` give you information about a user
> ## bugs:
> - `seeperms` => now if you don't indicate argument, bot will reply with your permissions
> - fixed minor bugs
> ## features:
> - Added a premium system: to get premium role, go on the support discord server

---

# 1.3.0
> ## commands:
> - `infos` command become `bot` command
> - `infos` is a new command: to get information about the server, a role, or a channel (information about a member is in developement)
> ## bugs:
> - `changelog list` command doesn't work
> - fixed minor bugs
> ## soon:
> - A Premium system: join the discord for more informations (use `bot` command)

---

# 1.2.3
> ## features:
> - for the settings notations: addition of `guild.name` and `guild.icon` (`avatar` changed to `user.avatar`)
> ## bugs:
> - `settings get` command doesn't work
> - fixed some minor bugs

---

# 1.2.2
> ## commands:
> - roletoall: has a cooldown between each user to give the role to
> - changelog: now can takes an argument: the version number or 'list' to see every version
> - seeperm: now the command take a 's' (seeperm**s**)
> ## bugs:
> - informations' image now working

---

# 1.2
> ## commands:
> - say
> - seeperm
> ## bugs:
> - leave message send the joinMessage
> - `settings list` command is too long at reply
> - `settings` doesn't require extra perm to use it
> ## inDev command:
> - `props (<server> or <member <member mention>> or <role <role mention>> or <channel <channel mention>>)` => see informations about the server or member or role or channel...

---

# 1.1.3
> ## commands:
> - changelog
> ## bugs:
> - when bot receive an invalid command, it deletes it
> - banned word: use first word if there is a space in the setting argument
> ## features:
> - custom join message (use `settings list` command)
> - custom leave message (use `settings list` command)

---

# 1.1.0
> ## commands:
> - settings
> ## features: