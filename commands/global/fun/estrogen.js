const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estrogen')
        .setDescription('gives the bot estrogen'),
    async execute(interaction) {
        await interaction.reply('https://archlinux.org/download');
    },
};

