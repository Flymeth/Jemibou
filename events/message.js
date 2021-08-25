const fs = require("fs");
const { getSettings } = require("../commands/settings");
const { check } = require("../tools/checkPremium");
module.exports = {
    name: "message",
    description: "When the bot receive a message",
    active: true,
    run: async (message, vars) => {
        if (message.channel.type === "dm" || message.author.bot) return;

        let settings = await getSettings(message.guild.id, vars, true);

        let args = message.content
            .replace(settings.prefix, "")
            .split(vars.configs.argumentsSeparator);

        if (
            settings.bannedWords.length > 0 &&
            message.channel.id !== settings.channelID
        ) {
            require("../tools/bannedWords").run(
                message,
                vars,
                args,
                settings.bannedWords
            );
        }

        if (!message.content.startsWith(settings.prefix)) {
            if (
                message.content.replace("!", "") === `<@${vars.client.user.id}>`
            ) {
                message.reply(
                    "My prefix on this server is `" + settings.prefix + "`!"
                );
            }
            return;
        }

        for (let perm of vars.configs.minPerms) {
            if (!message.guild.me.permissions.has(perm)) {
                try {
                    let embed = new vars.discord.MessageEmbed()
                        .setTitle("ERROR")
                        .setDescription(
                            `I don't have enought permission to work properly. Needed permission: \`${perm}\`!`
                        )
                        .setColor(vars.configs.colors.invalid);
                    await message.channel.send(embed);
                } catch (err) {
                    vars.log(err);
                }
                return;
            }
        }

        let cmdName = args.shift().split(" ").join("");

        if (!cmdName) return;

        const { commands } = vars;
        const cmd = commands.find((cmd) => {
            if (cmd.name.toLowerCase() === cmdName.toLowerCase()) return true;
            for (let alias of cmd.alias) {
                if (alias.toLowerCase() === cmdName.toLowerCase()) return true;
            }
        });

        if(!cmd) return

        if (cmd.ownersOnly) {
            let isOwner = false;
            for (let ownerid of vars.configs.owners) {
                if (ownerid === message.author.id) {
                    isOwner = true;
                }
            }
            if (!isOwner)
                return message.reply("Only my owners can do that command!");
        }

        if (cmd.premium) {
            const premium = await check(cmd.premium, vars, message.author);

            if (!premium)
                return message.reply(
                    "This command is only valable for `" +
                        cmd.premium +
                        "` users. More information on my support discord server (`" +
                        settings.prefix +
                        "links` to get the link)"
                );
        }

        if (cmd.deleteCommand) {
            try {
                await message.channel.messages.delete(message);
            } catch (err) {
                vars.log(err);
            }
        }

        for (let perm of cmd.permissions.user) {
            let hasPerm = message.channel.members
                .get(message.author.id)
                .permissions.has(perm);
            if (!hasPerm)
                return message.reply(`You haven't the \`${perm}\` permission!`);
        }

        for (let perm of cmd.permissions.bot) {
            let hasPerm = message.channel.members
                .get(vars.client.user.id)
                .permissions.has(perm);
            if (!hasPerm)
                return message.reply(`I haven't the \`${perm}\` permission!`);
        }
 
        vars.log(message.author.tag + " used command `" + cmd.name + "` with arg(s): `[" + args.join(",") + "]`", cmd.color);

        await message.guild.members.fetch({ force: true, cache: true });
        await message.channel.messages.fetch({ force: true, cache: true });

        const embed = new vars.discord.MessageEmbed()
        .setColor(cmd.color || message.guild.me.displayColor || "RANDOM");
        vars.newEmbed = () => {return embed}

        while (args[0] === "") {
            args.shift();
        }

        await cmd.run(message, vars, args, settings);
    },
};
