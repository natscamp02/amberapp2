const express = require('express');
const conn = require('../db');

const router = express.Router();

// Send to list of users
router.get('/', (req, res, next) => res.redirect('/students/list'));

// Display list of students
router.get('/list', (req, res, next) => {
	conn.query('SELECT * FROM students', (err, students) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		res.render('students/list', { students });
	});
});

// Show add form
router.get('/add', (req, res, next) => {
	res.render('students/add');
});

// Add a new student
router.post('/add', (req, res, next) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		class: req.body.class,
	};

	conn.query(
		'INSERT INTO students(first_name, last_name, class) VALUES (?, ?, ?)',
		Object.values(data),
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}

			res.redirect('/students/list');
		}
	);
});

// Show student edit form
router.get('/edit/:id', (req, res, next) => {
	conn.query('SELECT * FROM students WHERE id = ' + req.params.id, (err, students) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		if (!students.length) return res.redirect('/');

		res.render('students/edit', { student: students[0] });
	});
});

// Update student's info
router.post('/update', (req, res, next) => {
	const data = {
		id: Number.parseInt(req.body.student_id),
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		class: req.body.class,
	};

	conn.query(
		'UPDATE students SET first_name = ?, last_name = ?, class = ? WHERE id = ' + data.id,
		[data.first_name, data.last_name, data.class],
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}

			res.redirect('/students/list');
		}
	);
});

// Delete student record
router.get('/delete/:id', (req, res, next) => {
	conn.query('DELETE FROM students WHERE id = ' + req.params.id, (err, result) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}

		return res.redirect('/students/list');
	});
});

module.exports = router;
