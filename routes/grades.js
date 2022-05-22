const express = require('express');
const { protectRoute, restrictTo } = require('../utils');
const conn = require('../db');

const router = express.Router();

router.use(protectRoute, restrictTo('teacher'));

router.get('/', (req, res) => res.redirect('/grades/list'));

router.get('/list', (req, res, next) => {
	conn.query(
		'SELECT gd.*, st.first_name, st.last_name, st.class FROM grades gd, students st WHERE gd.student_id = st.id',
		(err, results) => {
			if (err) {
				console.log(err);
				return res.render('grades/list', {
					grades: [],
				});
			}

			results.forEach(
				(data) =>
					(data.average = Number((data.term1_grade + data.term2_grade + data.term3_grade) / 3).toFixed(2))
			);

			res.render('grades/list', {
				grades: results,
			});
		}
	);
});

router.get('/add', (req, res, next) => {
	conn.query('SELECT * FROM students', (err, students) => {
		if (err) {
			console.log(err);
			return res.redirect('/grades/list');
		}

		res.render('grades/add', {
			students,
		});
	});
});

router.post('/add', (req, res, next) => {
	const data = {
		student_id: req.body.student_id,
		term1_grade: req.body.term1_grade || 0,
		term2_grade: req.body.term2_grade || 0,
		term3_grade: req.body.term3_grade || 0,
	};

	let sqlQuery = 'INSERT INTO grades(student_id, term1_grade, term2_grade, term3_grade) VALUES (';
	sqlQuery += data.student_id + ',';
	sqlQuery += data.term1_grade + ',';
	sqlQuery += data.term2_grade + ',';
	sqlQuery += data.term3_grade + ')';

	conn.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
		}

		res.redirect('/grades/list');
	});
});

router.get('/edit/:id', (req, res, next) => {
	conn.query('SELECT * FROM grades WHERE id = ' + req.params.id, (err, grades) => {
		if (err) {
			console.log(err);
			return res.redirect('/grades/list');
		}

		res.render('grades/edit', { data: grades[0] });
	});
});
router.post('/update', (req, res, next) => {
	const data = {
		id: req.body.id,
		term1_grade: req.body.term1_grade || 0,
		term2_grade: req.body.term2_grade || 0,
		term3_grade: req.body.term3_grade || 0,
	};

	let sqlQuery = 'UPDATE grades SET ';
	sqlQuery += 'term1_grade = ' + data.term1_grade + ',';
	sqlQuery += 'term2_grade = ' + data.term2_grade + ',';
	sqlQuery += 'term3_grade = ' + data.term3_grade + ' ';
	sqlQuery += 'WHERE grades.id = ' + data.id;

	conn.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
		}

		res.redirect('/grades/list');
	});
});

router.get('/delete/:id', (req, res, next) => {
	conn.query('DELETE FROM grades WHERE id = ' + req.params.id, (err, result) => {
		if (err) {
			console.log(err);
		}

		res.redirect('/grades/list');
	});
});

module.exports = router;
