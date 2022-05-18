const path = require('path');
require('dotenv').config({ path: 'config.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { flash } = require('express-flash-message');

const conn = require('./db');

const baseRouter = require('./routes');
const authRouter = require('./routes/auth');
const gradesRouter = require('./routes/grades');
const studentsRouter = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 10 * 60 * 1000,
		},
	})
);
app.use(flash());

app.use('/auth', authRouter);
app.use('/grades', gradesRouter);
app.use('/students', studentsRouter);
app.use('/', baseRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

conn.connect((err) => {
	if (err) console.log(JSON.stringify(err));
	else console.log('Connected to database...');
});
