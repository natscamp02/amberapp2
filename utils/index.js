exports.protectRoute = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect('/auth/login');
	}

	next();
};

exports.restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.session.role)) return res.redirect('/auth/login');

		next();
	};
