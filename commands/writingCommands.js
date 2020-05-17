const $ = require("cheerio")
const rp = require("request-promise");
const fs = require("fs");

const ao3Users = fs.readFileSync("./commands/files/ao3Users.txt", "utf8").toString().split("\n");
const defaultSprintLength = 15;

var sprintTimeouts = {};
var preSprintTimeouts = {};

module.exports = {
	ficrec: function(message, args) {
		//Of our list of users we will grab a random user
		var url = "https://archiveofourown.org/users/-username-/bookmarks";
		var username = ao3Users[Math.floor(Math.random() * ao3Users.length)];
		url = url.replace("-username-", username).replace("-username-", username);

		//Of that user we will grab a random bookmark
		rp(url)
  			.then(function(html){
				var bookmarkIndex = Math.floor(Math.random() * ($(".userstuff", html).length-1));
				var bookmark = $(".userstuff", html).eq(bookmarkIndex).text().replace("s2", "\n");
				var title = $(".heading", $(".module", html).eq(bookmarkIndex*2)).text().replace(/\n+/g, "");
				message.channel.send({embed: {
					title: title,
					description: bookmark
				}});
  			})
  			.catch(function(err){
    			//handle error
				console.log(err);
  			});
	},
	prompt: function(message, args) {
		const url = "https://www.seventhsanctum.com/generate.php?Genname=writeprompt";
		//request our website, and then scrape the prompt off of it.
		rp(url)
			.then( function(html) {
				message.channel.send({embed:{
					description: $(".GeneratorResultPrimeBG", html).eq(0).text()
				}});
			})
			.catch(function(err) 
			{ console.log(err) });
	},
	sprint: function(message, args) {
		//make sure the sprint isn't in a dm
		if (message.guild === null) return;
		//get our guild id because each sprint is sperate to every server
		var guildId = message.channel.guild.id;

		//if we dont have a sprint running
		if (sprintTimeouts[guildId] == undefined || !sprintTimeouts[guildId].running) {
			var length = +args[0];
			if (args[0] == undefined) length = defaultSprintLength;
			if (isNaN(length)) { message.channel.send("Usage: sprint [length]\n" + args[0] + " is not a valid number."); return; }

			var minutesTo = 0;
			if (args[1] != "now") {
				var intervals = [ 15, 30, 45, 60 ];
				var minute = new Date().getMinutes();
				var minutesTo = intervals[Math.floor((minute / 60) * 4)] - minute;
				message.channel.send("@here Sprint starting in " + minutesTo + " minutes!");
			}

			sprintTimeouts[guildId] = new timer(function() {}, 0);
			sprintTimeouts[guildId].running = true;
			
			preSprintTimeouts[guildId] = new timer(function() {
				message.channel.send("@here Sprint has begun! Get writing!");
				sprintTimeouts[guildId] = new timer(function() {
					message.channel.send("@here Sprint has ended.");
					sprintTimeouts[guildId].running = false;
				}, length*60000);
			}, minutesTo * 60000);
		}
		//handle command if we do have our sprint running
		else if (args[0] === "cancel") {
			preSprintTimeouts[guildId].pause();
			sprintTimeouts[guildId].pause();
			sprintTimeouts[guildId] = undefined;
			
			message.channel.send("Sprint canceled.");
			return;
		}
		else if (args[0] == "time") {
			message.channel.send(Math.floor(sprintTimeouts[guildId].getTimeLeft()/1000/60).toString()+" minutes remaining.");
		}
		else {
			message.channel.send("A sprint is already running, get to writing");
		}
	}
}

//a custom timer function for the sprint command
function timer(callback, delay) {
    var id, started, remaining = delay, running;

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(callback(), remaining);
    }

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    }

    this.getTimeLeft = function() {
        if (running) {
            this.pause();
            this.start();
        }

        return remaining;
    }

    this.start();
}
