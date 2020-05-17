const getter = require('booru-getter');
const fs = require('fs');

const quirkList = fs.readFileSync('commands/files/quirksList.txt', 'utf8').toString().split("\n");

module.exports = {
	img: function(message, args) {
		var tags = "";
		for (let arg in args) {
			tags += "+"+arg;
		}
		getter.getRandom(tags, (url)=>{
			message.channel.send(url.slice(5));
		});
	},
	quirkfactor: function(message, args) {
		let numA = Math.floor(Math.random()*quirkList.length);
		let numB = Math.floor(Math.random()*quirkList.length);
		message.channel.send('you have a ' + quirkList[numA] + ' or a ' +  quirkList[numB] + ' quirk!');
	},
	quirkpls: function(message, args) {
		let num = Math.floor(Math.random()*quirkList.length);
		let chosenQuirk = quirkList[num];
		message.channel.send('${user}, you have a ' + chosenQuirk + ' quirk!');
	},
	quirkplz: function(message, args) {
		this.quirkpls(message, args);
	},
	roll: function(message, args) {
		if (isNaN(args[0]) || isNaN(args[1].replace('d', ""))) { message.channel.send("Invalid usage of roll.\nIts roll [num of dice] d[num of sides]"); return; }
		var diceNum = +args[0];
		var diceType = +(args[1].replace('d', ""));
		var out = "And it's"
		for (var i=0;i<diceNum;i++) {
			out += "\n" + Math.floor(Math.random() * Math.floor(diceType)+1); //Math.round(Math.random() * diceType);
		}
		message.channel.send(out);
	},
	scripture: function(message, args) {
		message.channel.send('Eventually I will quote scripture for you.');
	}
}
