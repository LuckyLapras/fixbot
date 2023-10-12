const { Client, Events, GatewayIntentBits } = require('discord.js');
const CONFIG = require('./config.json');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', message => {
    const twitLink = 'https://twitter.com/'
    const xLink = 'https://x.com/'
    const shortsLink = '.youtube.com/shorts/'
    const tiktokLink = '.tiktok.com/'
    var content = message.content
    if (content.includes(twitLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/twitter.com)[^(\s|?)]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//twit', '//vxtwit')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.includes(xLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/x.com)[^(\s|?)]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//x', '//vxtwitter')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.includes(shortsLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/(?:www.)?youtube.com\/shorts)[^\s]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('/shorts/', '/watch?v=')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.includes(tiktokLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/(?:www|vm).tiktok.com)[^\s]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('tiktok', 'vxtiktok')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.startsWith("t!invite")) {
        message.reply(`https://discord.com/api/oauth2/authorize?client_id=${CONFIG.app_id}&permissions=414464625664&scope=bot%20applications.commands`)
    }
});

client.login(CONFIG.token);
