const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

const User = require('../../models/User');

// @route    GET api/users
// @desc     Test route
// @access   Public
router.get('/test', (req, res) => res.send('Test route for users [GET]'));

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/test', (req, res) => {
  console.log(req.body);

  /*
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
  });
	*/

  /*
  res.status(HttpStatus.getStatusCode('Server Error')).send({
    error: 'Server Error',
  });
	*/

  res.status(HttpStatus.OK).send('Test route for users [POST]');
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // See if user exists

    // Get users gravatar

    // Encrypt password - bcrypt

    // Return jsonwebtoken

    try {
      console.log(req.body);
      res.send(`User route [2] [${name}][${email}][${password}]`);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
  },
);

router.post(
  '/final',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
  },
);

module.exports = router;
