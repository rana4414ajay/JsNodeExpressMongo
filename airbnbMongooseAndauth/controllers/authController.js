const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      email: "",
      password: ""
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "guest"
    },
  });
};


exports.postSignup = [
  check('firstName')
    .isLength({ min: 1 }).withMessage('First name is required')
    .matches(/^[a-zA-Z\s]*$/).withMessage('First name must contain only letters'),

  check('lastName')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Last name must contain only letters'),

  check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[@$#!%*?&]/).withMessage('Password must contain at least one special character')
    .trim(),

  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('userType')
    .isIn(['guest', 'host']).withMessage('User type must be either guest or host')
    .notEmpty().withMessage('User type is required'),

  check('terms')
    .equals('on').withMessage('You must accept the terms and conditions'),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
      });
    }

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      }).catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [err.message],
          oldInput: { firstName, lastName, email, password, userType },
          user: {},
        });
      });
  }
];

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).render("auth/login", {
      pageTitle: "login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid email or password"],
      oldInput: { email },
      user: {},
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).render("auth/login", {
      pageTitle: "login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid email or password"],
      oldInput: { email },
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
