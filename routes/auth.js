const express = require('express');
const bcrypt = require('bcrypt');
const conn = require('../db');

const router = express.Router();

// Redirect to login form
router.get('/', (req, res, next) => res.redirect('/auth/login'));

// Show signup form
router.get('/signup', (req, res, next) => res.render('auth/signup'));

// Create a new user
router.post('/signup', async (req, res, next) => {
	// Get data from form
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		password: req.body.password,
		role: req.body.role,
	};

	// Hash password
	data.password = await bcrypt.hash(data.password, 12);

	// Create a new user in the database
	conn.query('INSERT INTO users SET ?', data, (err, results) => {
		if (err) {
			console.log(err);
			return res.redirect(req.originalUrl);
		}

		req.session.isLoggedIn = true;
		req.session.first_name = data.first_name;
		req.session.role = data.role;

		res.redirect('/');
	});
});

// Show login form
router.get('/login', (req, res, next) => res.render('auth/login'));

// Attempt to log user in
router.post('/login', (req, res, next) => {
	const password = req.body.password;

	conn.query('SELECT * FROM users WHERE username = ?', [req.body.username], async (err, users) => {
		if (err) {
			console.log(err);
			return res.redirect('/auth/login');
		}

		if (!users.length) {
			console.log('Username is incorrect');
			return res.redirect('/auth/login');
		}

		if (await bcrypt.compare(password, users[0].password)) {
			req.session.isLoggedIn = true;
			req.session.first_name = users[0].first_name;
			req.session.role = users[0].role;

			res.redirect('/');
		}
	});
});

// Log user out
router.get('/logout', (req, res, next) => {
	req.session.destroy();

	res.redirect('/');
});

module.exports = router;
