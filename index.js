// adding a comment here to test git

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
    const ytLink = 'https://youtube.com/'
    const ytLink2 = 'https://youtu.be/'
    const redditLink = 'https://www.reddit.com/'
    const tumblrLink = 'https://www.tumblr.com/'
    const instaLink = 'https://www.instagram.com/'
    const tiktokLink = 'https://tiktok.com/'
    const bskyLink = 'https://bsky.app'
    var content = message.content
    var string = ''
    var links = []
    if (message.author.bot) {
        return
    }
    links = content.match(/(?<!\<)(?:\|\|)?(?:https:\/\/)[^\s]+/g)
    for (let l in links) {
        console.log(`link found: ${links[l]}`)
        if (links[l].includes(twitLink)) {
            var link = links[l].match(/(?:https:\/\/twitter\.com\/.{1,20}\/status\/)[^(\s|?)]+/gi)
            var fxlink = ''
            fxlink = link[0].replace('//twitter', '//fxtwitter')
        } else if (links[l].includes(xLink)) {
            var link = links[l].match(/(?:https:\/\/x\.com\/.{1,20}\/status\/)[^(\s|?)]+/gi)
            var fxlink = ''
            fxlink = link[0].replace('//x', '//fxtwitter')
        } else if (links[l].includes(ytLink) || links[l].includes(ytLink2)) {
            if (links[l].includes('/shorts/')) {
                var link = links[l].match(/(?:https:\/\/(?:www\.)?youtube\.com\/shorts)[^\s]+/gi)
                var fxlink = ''
                fxlink = link[0].replace('/shorts/', '/watch?v=')
            } else {
                var timestamp = links[l].match(/(?<=t=)\d+/)
                var link = links[l].match(/(?:https:\/\/(?=((?:www\.)?youtube\.com\/|youtu\.be)))[^\s]+(?=(&pp=|&ab_channel=i|\?si=))/gi)
                var fxlink = ''
                if (timestamp) {
                    fxlink = `${link[0]}&t=${timestamp}`
                } else {
                    fxlink = link[0]
                }
            }
        } else if (links[l].includes(redditLink)) {
            var link = links[l].match(/(?:https:\/\/(?:(www\.|old\.|new\.|dd\.))reddit\.com)[^(\s|?)]+/gi)
            var fxlink = ''
            fxlink = link[0].replace('reddit', 'rxddit')
        } else if (links[l].includes(tumblrLink)) {
            var link = links[l].match(/(?:https:\/\/www\.tumblr\.com)[^(\s|?)]+/gi);
            var fxlink = ''
            var name = link[0].split('/')[3];
            var id = link[0].split('/')[4];
            if (id == 'tagged') {
                var tag = link[0].split('/')[5];
                fxlink = `https://${name}.tumblr.com/${id}/${tag}`;
            } else {
                fxlink = `https://${name}.tumblr.com/post/${id}`;
            }
        } else if (links[l].includes(instaLink)) {
            var link = links[l].match(/(?:https:\/\/www\.instagram\.com\/)[^(\s|?)]+/gi);
            var fxlink = ''
            fxlink = link[0].replace('instagram', 'ddinstagram')
        } else if (links[l].includes(tiktokLink)) {
            var link = links[l].match(/(?:https:\/\/www\.tiktok\.com)[^(\s|?)]+/gi);
            var fxlink = ''
            fxlink = link[0].replace('tiktok', 'vxtiktok')
        } else if (links[l].includes(bskyLink)) {
            var link = links[l].match(/(?:https:\/\/bsky\.app\/profile\/.+?\/post\/)[^\s]+/gi);
            var fxlink = ''
            fxlink = link[0].replace('bsky', 'fxbsky')
        } else if (content.startsWith("t!invite")) {
            message.reply(`invite this bot with https://discord.com/api/oauth2/authorize?client_id=${CONFIG.app_id}&permissions=412317182976&scope=bot%20applications.commands or clone the repo and host it yourself https://github.com/LuckyLapras/fixbot`)
        }

        if (fxlink) {
            if (link[0].includes('||')) {
                fxlink = `||${fxlink}`;
            }
            if (link[0].includes('/grok/')) {
                fxlink = 'fucking kill yourself'
            }
            console.log(`link fixed: ${fxlink}`)
            string += `${fxlink} `
        }
    }
    if (string) {
        console.log(`string created: ${string}`)
        try {
            const replyAndRemoveEmbed = async () => {
                const reply = await message.reply(`${string}`);
                message.suppressEmbeds(true);
                console.log('reply sent')
            }
            replyAndRemoveEmbed();
        } catch (error) {
            console.log(error);
        }
    }
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands/global');
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
