const { Client, Events, GatewayIntentBits } = require('discord.js');
const CONFIG = require('./config.json');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    allowedMentions: { repliedUser: false }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', message => {
    const twitLink = 'https://twitter.com/'
    const xLink = 'https://x.com/'
    const shortsLink = '.youtube.com/shorts/'
    const tiktokLink = '.tiktok.com/'
    const tumblrLink = 'https://www.tumblr.com'
    var content = message.content
    if (content.includes(twitLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/twitter.com)[^(\s|?)]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//twit', '//fxtwit')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.includes(xLink)) {
        message.react('🇧🇷')
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/x.com)[^(\s|?)]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//x', '//fxtwitter')
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
    } if (content.includes(tumblrLink)) {
        message.suppressEmbeds(true)
        let link = content.match(/(?<!\<)(?:https:\/\/www.tumblr.com)[^(\s|?)]+/gi);
        var string = ''
        for(let l in link) {
            let fxlink = []
            var name = link[l].split('/')[3];
            var id = link[l].split('/')[4];
            fxlink[l] = `https://${name}.tumblr.com/post/${id}`;
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.startsWith("t!invite")) {
        message.reply(`invite this bot with https://discord.com/api/oauth2/authorize?client_id=${CONFIG.app_id}&permissions=414464625664&scope=bot%20applications.commands or clone the repo and host it yourself https://github.com/LuckyLapras/fixbot`)
    }
});

client.login(CONFIG.token);
