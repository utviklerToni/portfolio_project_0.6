const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// #route type > POST
// #endpoint   > api/users
// #name       > test route
// #access     > public
router.post(
	'/',
	[
		check('name', 'Name is necessary').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password of minimum 6 characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// destructring body request
		const { name, email, password } = req.body;

		try {
			// checking if user exists
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			// fetching gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			// ### setting new instance of User() to the variable above "user"
			user = new User({
				name,
				email,
				avatar,
				password,
			});

			// encrypting password
			// ### first we need to create a salt to do the hashing
			const salt = await bcrypt.genSalt(12);

			// now grabbing the password from the "user variable"
			// of the new User instance
			user.password = await bcrypt.hash(password, salt);

			// now saving user to database which gives a promise as well
			await user.save();

			// returning JWT

			const payload = {
				user: {
					// mongodb already extracts its "_id" as id
					id: user.id,
				},
			};

			// ### signing token
			// plzz use less seconds than 360000 in production
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

module.exports = router;
