var User = require('./userModel.js');
var db = require('../config/config.js');
var jwt = require('jwt-simple');



module.exports = {
	signin: function(req, res, next) {
		console.log(req.body.email, req.body.password)
		db.select().from('users')
			.where('email', req.body.email)
			.then(function(user) {
				console.log('we have user :', user)
				console.log(' and still have pass: ', req.body.password)
				if (!user) {
					next(new Error('User does not exist!'));
				}
				else {
					User.signin(req.body.email, req.body.password, function(err, match) {
						if (err) {
							next(new Error('Wrong password!'));
						}
						else {
							var token = jwt.encode(user, 'secret');
							res.json({token: token});
						}
					});
				}
			})
	},

	signup: function (req, res, next) {
		var user1;

		console.log('signing up with: ', req.body)
		db.select().from('users')
			.where('email', req.body.email)
			.then(function (user) {
				user1 = user
				console.log('found user: ', user)
				if (user.length) {
					next(new Error('User already exists!'));
				} else {
					User.signup(req.body, (err, response) => {
						return response
					})
				}
			})
			.then(function () {
				var token = jwt.encode(user1, 'secret');
				res.json({
					token: token
				});
			})
	},

	getUsers: function(req, res, next) {
		User.getUsers((err, response) => {
			if (err) {
				next(new Error('Couldn\'t find users. '));
			}
			else {
				res.send(response);
			}
		});
	},

	updateUser: function(req, res, next) {
		User.updateUser(req.body, (err, response) => {
			if (err) {
				next(new Error('Couldn\'t save new user.'));
			}
			else {
				res.sendStatus(200);
			}
		})
	}
}