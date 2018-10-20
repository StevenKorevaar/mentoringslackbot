'use strict';

var MentorBot = require('../lib/mentorbot.js');

//var token = process.env.BOT_API_KEY || require('../token');
var token = "xoxb-461935823830-461938528934-5eWGD86mCiS1yKUvUHuWh46K";
//var dbPath = process.env.BOT_DB_PATH;
var dbPath = "data/timetable.db";
var name = process.env.BOT_NAME;

var mentorbot = new MentorBot({
    token: token,
    dbPath: dbPath,
    name: name
});

mentorbot.run();

// To RUN
// set BOT_API_KEY=xoxb-461935823830-461938528934-5eWGD86mCiS1yKUvUHuWh46K & node bin/bot.js