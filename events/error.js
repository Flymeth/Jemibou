module.exports = {
    name: "error",
    description: "When the bot has error",
    active: true,
    run: (e, vars) => {
        return vars.log(e, vars.configs.colors.invalid, "ERROR")
    }
}