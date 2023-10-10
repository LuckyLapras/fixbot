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
    var content = message.content
    if (content.includes(twitLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/twitter.com)[^\s]+/gi)
        var string = ''
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//twit', '//vxtwit')
            string += `${fxlink[l]} `
        }
        if (string) message.reply(`${string}`);
    } else if (content.startsWith("t!invite")) {
        message.reply(`https://discord.com/api/oauth2/authorize?client_id=${CONFIG.app_id}&permissions=414464625664&scope=bot%20applications.commands`)
    }
});

client.login(CONFIG.token);
