const normalFont = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const customfonts = [
	{
		"name": "carrier",
		"font": "ᗩᗷᑕᗪᕮᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇSTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪᕮᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇSTᑌᐯᗯ᙭Yᘔ0123456789"
	},
	{
		"name": "mirror",
		"font": "ɐqɔpǝɟɓɥᴉſʞๅɯuodbɹsʇnʌʍxʎzⱯꓭꓛꓷƎꓞꓨHIſꓘꓶWNOꓒῸꓤSꓕꓵꓥMX⅄Z0123456789"
	},
	{
		"name": "circled",
		"font": "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨"
	},
	{
		"name": "panther",
		"font": "ΔBCDEҒGĦIJKLMṈOᕈⵕRSΓUVWXɎẔΔBCDEҒGĦIJKLMṈOᕈⵕRSΓUVWXɎẔ0123456789"
	},
	{
		"name": "smooth",
		"font": "αвc∂єƒgнιנкℓмησρqяѕтυνωχуzAƁƇƊƐƑƓHIJƘLMƝOƤQRSƬUƲƜXƳƵ0123456789"
	},
	{
		"name": "spooky",
		"font": "ᥲᑲᥴᑯᥱƒɠᖾɩʝƙꙆຕᥒoρϙɾ⳽tᥙʋωxყⱬABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	},
	{
		"name": "spaced",
		"font": "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９"
	},
	{
		"name": "runes",
		"font": "ᚣᛒᛈᚧᛊᚪᛩᚺᛁⳖⲔᚳᛖᚢᛜᚹᛰᚱᛢᚾⳘꓦⰞᚷᛉჍᚣᛒᛈᚧᛊᚪᛩᚺᛁⳖⲔᚳᛖᚢᛜᚹᛰᚱᛢᚾⳘꓦⰞᚷᛉჍ0123456789"
	},
	{
		"name": "curly",
		"font": "ᗣᙖᙅᙃᙓᖴᘜᕼꙆᒍКᒐᙏᙁOᕈᕋᖇᔑƮᙀᘎᙎXƳⱿᗣᙖᙅᙃᙓᖴᘜᕼꙆᒍКᒐᙏᙁOᕈᕋᖇᔑƮᙀᘎᙎXƳⱿ0123456789"
	},
	{
		"name": "dwarf",
		"font": "ᵃᵇᶜᵈᵉᶠᵍʰᶤʲᵏˡᵐᶰᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁᵛᵂᵡᵞᶻ⁰¹²³⁴⁵⁶⁷⁸⁹"
	}
]

module.exports = {
	name: "customfont",
	alias: ["font", "fancy"],
	description: "Get your text with a custom font!",
	ownersOnly: false,
	active: true,
	type: "usefull",
	color: "#ff0000",
	arguments: "[font_name <text>]",
	deleteCommand: true,
	premium: "vip",
	permissions: {
		bot: [],
		user: []
	},
	run: (e, vars, args, settings) => {

		function changeFont(message, fontname) {
			const font = customfonts.find(f => f.name.toLocaleLowerCase().includes(fontname.toLowerCase()))
			if(!font) return false

			let newMessage = ""
			for(let letter of message) {
				const index = normalFont.indexOf(letter)
				if(index === -1) {
					newMessage+= letter
					continue
				}

				newMessage+= font.font[index]
			}
			
			return newMessage
		}

		var msg = ""
		const font = args.shift()
		if (!font) {
			const embed = vars.newEmbed()
			.setTitle('List of the custom font:')
			const customMsg = "This is a cool message with a custom font!"
			for(let font of customfonts) {
				embed.addField(`*${settings.prefix}customfont ${font.name} <your text>*`, '```' + changeFont(customMsg, font.name) + '```')
			}

			e.channel.send(embed)
		} else {
			msg = changeFont(args.join(' '), font)
		
			if(!msg) return e.reply("this font is invalid!").then(msg => vars.setEndMessage("🔤", msg))
			e.channel.send(msg)
		}
	}
}