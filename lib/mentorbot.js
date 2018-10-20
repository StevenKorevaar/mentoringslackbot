'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var h = require('./helpers.js');

var links = {
	registrationForm: 'https://docs.google.com/forms/d/e/1FAIpQLScSiP7nb024mfx7WR4SX-XTrVp',
	missedShiftForm: 'https://docs.google.com/forms/d/e/1FAIpQLSekPmnstHZN786lDQjJsQRPOkgf9AMugUUt_2iZAbHJdYdSMg/viewform',
	registrationSheet: 'https://drive.google.com/open?id=1NnMwNnbEESjCmzQpLiJWBIK8cTzJBkdXWAVv_PkRmNI'
}


var MentorBot = function Constructor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'mentor_bot';
	this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'MentorBot.db');

	this.user = null;
	this.db = null;
};

util.inherits(MentorBot, Bot);


MentorBot.prototype.run = function () {
	MentorBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};


MentorBot.prototype._onStart = function () {
	this._loadBotUser();
	this._connectDb();
	this._firstRunCheck();
};


MentorBot.prototype._onMessage = function (message) {
	if(this._isChatMessage(message) &&
			this._isChannelConversation(message) &&
			!this._isFromMentorBot(message)
	) {

		var containsRoomCode = 
			h.msgContains(message, 'room code') ||
			h.msgContains(message, 'door code') ||
			h.msgContains(message, 'password');

		if (containsRoomCode) {
			this._sendMessage('The room code is 842Z', this._getChannelById(message.channel).name);
			return;
		}

		var missedShift = 
			h.msgContains(message,'shift') &&
			( h.msgContains(message, 'can\'t') ||
				h.msgContains(message, 'cant') ||
				h.msgContains(message, 'cannot') ||
				h.msgContains(message, 'won\'t') ||
				h.msgContains(message, 'wont') );

		if (missedShift) {
			
			var sender = this.users.filter(function (user) {
				//console.log(user.id+", "+message.user);
				return user.id === message.user;
			})[0];
			//console.log(sender);
			this._sendMessage('Hey, '+sender.profile.display_name+'! Can you please fill out the Missed Shifts form? \
				'+links['missedShiftForm'], this._getChannelById(message.channel).name);
			return;
		}

	}
};


/**
 * Replyes to a message with a random Joke
 * @param {object} originalMessage
 * @private
 */
MentorBot.prototype._replyWithRandomJoke = function (originalMessage) {
	var self = this;
	self.db.get('SELECT id, joke FROM jokes ORDER BY used ASC, RANDOM() LIMIT 1', function (err, record) {
		if (err) {
			return console.error('DATABASE ERROR:', err);
		}

		var channel = self._getChannelById(originalMessage.channel);
		self.postMessageToChannel(channel.name, record.joke, {as_user: true});
		self.db.run('UPDATE jokes SET used = used + 1 WHERE id = ?', record.id);
	});
};

MentorBot.prototype._loadBotUser = function () {
	var self = this;
	//console.log("HERE");
	this.user = this.users.filter(function (user) {
		//console.log(user.name+", "+self.name);
		return user.name === self.name;
	})[0];
	//console.log(this.user);
};


MentorBot.prototype._connectDb = function () {
	if (!fs.existsSync(this.dbPath)) {
		console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
		process.exit(1);
	}

	this.db = new SQLite.Database(this.dbPath);
};


MentorBot.prototype._firstRunCheck = function () {
	var self = this;
	self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
		if (err) {
			return console.error('DATABASE ERROR:', err);
		}

		var currentTime = (new Date()).toJSON();

		// this is a first run
		if (!record) {
			return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
		}

		// updates with new last running time
		self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
	});
};


MentorBot.prototype._isChatMessage = function (message) {
	return message.type === 'message' && Boolean(message.text);
};


MentorBot.prototype._isChannelConversation = function (message) {
	return typeof message.channel === 'string' &&
		message.channel[0] === 'C';
};

MentorBot.prototype._isFromMentorBot = function (message) {
	var msg = message.user;
	var curID = this.user.id;
	return msg === curID;
};

MentorBot.prototype._getChannelById = function (channelId) {
	return this.channels.filter(function (item) {
		return item.id === channelId;
	})[0];
};

MentorBot.prototype._sendMessage = function (message, channel) {
	this.postMessageToChannel(channel, message, {as_user: true, link_names: true, parse: 'full'});
}

module.exports = MentorBot;