const express = require('express');
const { protectRoute } = require('../utils');
const conn = require('../db');

const router = express.Router();

router.get('/', protectRoute, (req, res, next) => {
	conn.query('SELECT * FROM grades', (err, results) => {
		res.render('grades/list', {
			grades: results,
		});
	});
});

module.exports = router;
