const { Client } = require("discord.js");
const client = new Client();
const config = require("./config.json");
const fs = require("fs");

var name = "Bot"; // Name of bot

var helpMessage = fs.readFileSync("data/help.txt", "utf8"); // Stores help.txt file

// On bot start-up, 
client.on("ready", () => {
    console.log(name + " is now running.");
    
});

// On every message the bot has access to, 
client.on("message", async message => {

    // Ignore bot messages and messages without the prefix defined in the config file
    if(message.author.bot || !message.content.startsWith(config.prefix)) return;

    // Sets the command given
    let cmd = message.content.toLowerCase().split(" ")[0].slice(config.prefix.length);

    // Sets arguments for the given command
    let args = message.content.split(" ").slice(config.prefix.length);
    // Sets lower-case arguments for the given command
    let lowArgs = message.content.toLowerCase().split(" ").slice(config.prefix.length);
    
    // Determine what command is given
    switch(cmd) {

        case "help":
        case "commands":
            message.author.send(helpMessage);
            message.reply("Help has been sent to your DMs!\n"
                + "*Make sure your privacy settings allow messages from users in this server!*"
            );
        break;

        case "say":
            message.delete(); // Deletes command message
            message.channel.send(args.join(" ")); // Sends arguments
        break;

        case "purge":
            // Get number of messages to delete
            let num = parseInt(args[0]);

            // Ensure a number is given
            if(isNaN(num)) return message.reply("Please use a number.");

            // Fetch messages
            let fetched = await message.channel.fetchMessages({limit: num+1});

            // Delete fetched messages
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`));
        break;

    }

});

// Logs in using bot token from config file
client.login(config.token);
