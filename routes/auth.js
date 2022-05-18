const express = require('express');
const conn = require('../db');

const router = express.Router();

// Redirect to login form
router.get('/', (req, res, next) => res.redirect('/auth/login'));

// Show login form
router.get('/login', (req, res, next) => {
	res.render('auth/login');
});

// Attempt to log user in
router.post('/login', (req, res, next) => {
	const data = {
		username: req.body.username,
		password: req.body.password,
	};

	conn.query('SELECT * FROM users WHERE username = ? AND BINARY password = ?', Object.values(data), (err, users) => {
		if (err) {
			console.log(err);
			return res.redirect('/auth/login');
		}

		if (!users.length) {
			console.log('Incorrect credentials');
			return res.redirect('/auth/login');
		}

		req.session.isLoggedIn = true;
		req.session.first_name = users[0].first_name;
		req.session.role = users[0].role;

		res.redirect('/');
	});
});

// Log user out
router.get('/logout', (req, res, next) => {
	req.session.destroy();

	res.redirect('/');
});

module.exports = router;
