const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// rome-ignore lint/nursery/noConsoleLog: <explanation>
		console.log(`Ready! Logged in as ${client.user.tag}`);
	}
};
