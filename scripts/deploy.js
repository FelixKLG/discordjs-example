const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();

const commands = [];

const commandsPath = path.join(__dirname, "../src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
	} else {
		// rome-ignore lint/nursery/noConsoleLog: <explanation>
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		// rome-ignore lint/nursery/noConsoleLog: <explanation>
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands
		});

		// rome-ignore lint/nursery/noConsoleLog: <explanation>
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
