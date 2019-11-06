module.exports = {
	ping: function(message, args) {
		message.channel.send("Pong");
	},
	blah: function(message, args) {
		message.channel.send("Meh.")
	},
	foo: function(message, args) {
		message.channel.send("bar!");
	},
	help: function(message, args) {
		message.channel.send("Instead of an actual help file, you should go to \<https://toyhou.se/1787487\> for the time being.");
	}/*,        this is an example fo how you add another function
	functionName: function(message, args) {
		//put function here
	}*/
}
