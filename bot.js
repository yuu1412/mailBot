const Discord = require('discord.js');
const client = new Discord.Client();

var cmds = [];

var i = 0;
require("fs").readdirSync("./commands").forEach(function(file) {
	if (file.endsWith(".js")) cmds.push(require("./commands/" + file));
  	i++
});

const prefix = "mj!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	if (message.author.equals(client.user)) return;
	if (!message.content.startsWith(prefix)) return;
	
	const args = message.content.replace("\n", "").slice(prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();
	
	var foundCommand = false;
	for (let cmd in cmds) {
		if (typeof cmds[cmd][command] === "function")	{
			cmds[cmd][command](message, args);
			foundCommand = true;
			return;
		}
	}
	if (!foundCommand) message.channel.send("You failed. "+command+" wasn't a valid command, dumbass.");
});

client.login(process.env.BOT_TOKEN);
