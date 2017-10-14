const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const {
  JWT_SECRET,
  PASSWORD_REGEX
} = require('../config');
const { getBeautifulMongoError } = require('../tools');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: ['email is required'],
    trim: true,
    lowercase: true,
    maxlength: [60, 'email must not exceed 60 characters'],
    validate: {
      validator: email => validator.isEmail(email),
      message: '{VALUE} is invalid email'
    },
    unique: true
  },
  password: {
    type: String,
    required: ['password is required'],
    trim: true,
    minlength: [8, 'password must contain at least 8 characters'],
    maxlength: [40, 'password must not exceed 40 characters'],
    match: [PASSWORD_REGEX, 'password must contain at least 1 digit, lower- and uppercase english letter']
  },
  username: {
    type: String,
    required: ['username is required'],
    trim: true,
    minlength: [4, 'username must contain at least 4 characters'],
    maxlength: [15, 'username must not exceed 15 characters'],
    validate: {
      validator: username => validator.isAlphanumeric(username),
      message: 'username must be alphanumeric'
    },
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: phone => validator.isMobilePhone(phone),
      message: 'invalid mobile phone format'
    },
    unique: true
  }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (this.isModified('password'))
    this.password = bcrypt.hashSync(this.password);
  next();
});

userSchema.post('save', getBeautifulMongoError);

userSchema.methods = {
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  },

  toJSON() {
    const user = this.toObject();
    delete user.password;
    return user;
  },

  genToken() {
    return jwt.sign(
      { _id: this._id },
      JWT_SECRET,
      { expiresIn: 9000 }
    );
  }
};

module.exports = mongoose.model('User', userSchema);