let {next} = require('../tools/status')
const {change} = require('../tools/changeStatusMessage')
module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: async (e, vars) => {
        vars.saveLog()

        vars.client.user.setActivity("try to wake up...", {type: "PLAYING"})

        change("Turned on!", vars.configs.colors.valid, vars)
        
        vars.log(`connected as ${vars.client.user.tag}! (version ${vars.package.version})`, vars.configs.colors.valid, "STATUS");

        vars.statusInterval = setInterval(async () => {
            let settedStatus = await next(vars)
            if(!settedStatus) {
                vars.log(`error to set status!`, vars.configs.colors.invalid, "ERROR")
            }
        }, vars.configs.statusInterval);
    }
}