const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
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

client.on('messageCreate', async message => {
    const twitLink = 'https://twitter.com/'
    const xLink = 'https://x.com/'
    const ytLink = 'youtube.com/'
    const redditLink = 'https://www.reddit.com'
    const tumblrLink = 'https://www.tumblr.com'
    const instaLink = 'https://www.instagram.com'
    const tiktokLink = 'tiktok.com'
    const bskyLink = 'bsky.app'
    var content = message.content
    var string = ''
    if (content.includes(twitLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/twitter\.com\/.{1,20}\/status\/)[^(\s|?)]+/gi)
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//twitter', '//m.fxtwitter')
            string += `${fxlink[l]} `
        }
    } else if (content.includes(xLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/x\.com\/.{1,20}\/status\/)[^(\s|?)]+/gi)
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('//x', '//m.fxtwitter')
            string += `${fxlink[l]} `
        }
    } else if (content.includes(ytLink)) {
        if (content.includes('/shorts/')) {
            let link = content.match(/(?<!\<)(?:https:\/\/(?:www\.)?youtube\.com\/shorts)[^\s]+/gi)
            for (let l in link) {
                let fxlink = []
                fxlink[l] = link[l].replace('/shorts/', '/watch?v=')
                string += `${fxlink[l]} `
            }
        } else {
            let link = content.match(/(?<!\<)(?:https:\/\/(?:www\.)?youtube\.com\/)[^\s]+(?=(&pp=|&ab_channel=i|\?si=))/gi)
            for (let l in link) {
                let fxlink = []
                fxlink[l] = link[l]
                string += `${fxlink[l]} `
            }
        }
    } else if (content.includes(redditLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/(?:(www\.|old\.|new\.|dd\.))reddit\.com)[^(\s|?)]+/gi)
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('reddit', 'rxddit')
            string += `${fxlink[l]} `
        }
    } else if (content.includes(tumblrLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/www\.tumblr\.com)[^(\s|?)]+/gi);
        for(let l in link) {
            let fxlink = []
            var name = link[l].split('/')[3];
            var id = link[l].split('/')[4];
            fxlink[l] = `https://${name}.tumblr.com/post/${id}`;
            string += `${fxlink[l]} `
        }
    } else if (content.includes(instaLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/www\.instagram\.com\/)[^(\s|?)]+/gi);
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('instagram', 'ddinstagram')
            string += `${fxlink[l]} `
        }
    } else if (content.includes(tiktokLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/www\.tiktok\.com)[^(\s|?)]+/gi);
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('tiktok', 'vxtiktok')
            string += `${fxlink[l]} `
        }
    } else if (content.includes(bskyLink)) {
        let link = content.match(/(?<!\<)(?:https:\/\/bsky\.app\/profile\/.+\/post\/.+)/gi);
        for (let l in link) {
            let fxlink = []
            fxlink[l] = link[l].replace('bsky', 'fxbsky')
            string += `${fxlink[l]}`
        }
    } else if (content.startsWith("t!invite")) {
        message.reply(`invite this bot with https://discord.com/api/oauth2/authorize?client_id=${CONFIG.app_id}&permissions=412317182976&scope=bot%20applications.commands or clone the repo and host it yourself https://github.com/LuckyLapras/fixbot`)
    }

    if (string) {
        if (content.includes('||')) {
            string = `||${string}||`;
        }
        try {
            const replyAndRemoveEmbed = async () => {
                const reply = await message.reply(`${string}`);
                message.suppressEmbeds(true);
            }
            replyAndRemoveEmbed();
        } catch (error) {
            console.log(error);
        }
    }
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(CONFIG.token);
