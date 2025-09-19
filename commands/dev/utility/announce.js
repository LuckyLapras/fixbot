const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('makes announcement in every server')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('title'))
        .addStringOption(option =>
            option.setName('body')
                .setDescription('body')),
    async execute(interaction) {
        const title = interaction.options.getString('title')
        const body = interaction.options.getString('body')
        const bodyRaw = String.raw`${body}`
        const announceEmbed = new EmbedBuilder()
            .setColor(0xE86F56)
            .setTitle(`${title}`)
            .setDescription(`${bodyRaw}`)

        var guildList = interaction.client.guilds.cache;
        try {
            guildList.forEach(async (guild) => {
                const channelID = guild.systemChannelId;
                const channel = await interaction.client.channels.cache.get(channelID)
                if (!channel) return; // if it couldn't find a text channel, skip this guild
                    channel.send({ embeds: [announceEmbed] }); // otherwise, send the message
                });
                //console.log(channel)});
                //interaction.reply({ embeds: [announceEmbed] })});
        } catch (err) {
             console.log(err);
        }
        //try {
        //    await interaction.reply({ embeds: [announceEmbed] });
        //} catch (e) {
        //    console.log(e)
        //}
    },
};

