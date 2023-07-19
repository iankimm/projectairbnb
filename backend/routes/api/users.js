// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '',
  //validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;



    if(!email.includes('@,!#$%^&*()?><') || username === '' || firstName === '' || lastName === '') {
      res.status(400);
      return res.json({
        "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
      })
    }

    const checkEmail = await User.findOne({where: {email: email}});
    if(checkEmail) {
      res.status(500);
      return res.json({
        "message": "User already exists",
      "errors": {
        "email": "User with that email already exists"
      }
      })
    }

    const checkUserName = await User.findOne({where: {username: username}});
    if(checkUserName) {
      res.status(500);
      return res.json({
        "message": "User already exists",
      "errors": {
        "username": "User with that username already exists"
      }
      })
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;
//is
