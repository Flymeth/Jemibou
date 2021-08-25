const wikipediaRandomPageLink = "https://en.wikipedia.org/wiki/Special:Random"
module.exports = {
    name: "wikipedia",
    description: "Play alone or with your friend to the funny wikipedia challenge game!",
    help: "When you use this command, i'll send you a wikipedia starting webpage and a wikipedia finishing webpage. Your goal is to find the finished webpage just by clicking on the links that you find in each wikiepedia webpage by starting by the starting webpage. You musn't use the 'search words' option: just scroll and click :)",
    start: async (e, player, vars, settings) => {
        const embed = e.embeds[0]
        .setDescription("You need to navigate")
        .addField("From:", `[this page](${wikipediaRandomPageLink})`)
        .addField("To:", `[this page](${wikipediaRandomPageLink})`)
        .setFooter("Good luck :)")

        e.edit(embed)
    }
}