const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('postthissmudge')
        .setDescription('posts this smudge'),
    async execute(interaction) {
        await interaction.reply('https://files.catbox.moe/7fuu19.jpg');
    },
};

