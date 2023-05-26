const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const http = require("../lib/unsplash");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cat")
		.setDescription("Fetch a random cat picture.")
		.addBooleanOption((option) => option.setName("kitten").setDescription("Fetch a random kitten picture.")),
	async execute(interaction) {
		const query = interaction.options.getBoolean("kitten") ? "kitten" : "cat";

		let photo;

		try {
			photo = await http.get("photos/random", { params: { query: query } });
		} catch {
			interaction.reply({ content: "Soz, got sad. 🤷‍♀️", ephemeral: true });
			return;
		}

		const title = () => {
			if (!photo.data.description) {
				return "Random Cat 🐈";
			}

			if (photo.data.description.length > 20) {
				return `${photo.data.description.substr(0, 20)}...`;
			}

			return photo.data.description;
		};

		const embed = new EmbedBuilder()
			.setTitle(title())
			.setImage(photo.data.urls.raw)
			.setURL(photo.data.links.html)
			.setFooter({
				text: "Powered by Unsplash",
				iconURL: "https://images.unsplash.com/profile-1544707963613-16baf868f301"
			})
			.setAuthor({
				name: photo.data.user.name,
				iconURL: photo.data.user.profile_image.small,
				url: photo.data.user.links.html
			});

		await interaction.reply({ embeds: [embed] });
	}
};
