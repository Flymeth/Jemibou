const fs = require("fs")

/**
 * Get each commands of the bot
 * @param {Object} vars The main variables object
 */
module.exports.getCommands = (vars) => {
    let allCommands = []
    try {
        var commands = fs.readdirSync(vars.configs.commandsPath)
    } catch (e) {
        vars.log(e)
    }

    for(let cmd of commands) {
        if(!cmd.endsWith(".js") || cmd.startsWith('_')) continue
        try {
            var mdl = require('.' + vars.configs.commandsPath + cmd.replace('.js', '')) 
        } catch (err) {
            vars.log("unable to load the " + cmd + " module.")
            continue
        }
        if(mdl.active) allCommands.push(mdl)
    }

    vars.log("Commands loaded")

    return allCommands
}

/**
 * Get each events of the bot
 * @param {Object} vars The main variables object
 */
module.exports.getEvents = (vars) => {
    let allEvents = []
    try {
        var events = fs.readdirSync(vars.configs.eventsPath)
    } catch (e) {
        vars.log(e);
    }

    for(let event of events) {
        if(!event.endsWith('.js') || event.startsWith('_')) continue
        try {
            var mdl = require('.' + vars.configs.eventsPath + event.replace('.js', ''))
        } catch (err) {
            vars.log("unable to load the " + event + " module.")
            continue
        }
        if(mdl.active) allEvents.push(mdl)
    }

    vars.log("Events loaded!")

    return allEvents
}