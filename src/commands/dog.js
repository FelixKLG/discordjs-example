const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const http = require("../lib/unsplash");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dog")
		.setDescription("Fetch a random dog picture.")
		.addBooleanOption((option) => option.setName("puppy").setDescription("Fetch a random puppy picture.")),
	async execute(interaction) {
		const query = interaction.options.getBoolean("puppy") ? "puppy" : "dog";

		let photo;

		try {
			photo = await http.get("photos/random", { params: { query: query } });
		} catch {
			interaction.reply({ content: "Soz, got sad. 🤷‍♀️", ephemeral: true });
			return;
		}

		const title = () => {
			if (!photo.data.description) {
				return "Random Dog 🐕";
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
