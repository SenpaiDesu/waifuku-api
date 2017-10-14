const jwt = require('jsonwebtoken');
const db = require('../models');
const { JWT_SECRET } = require('../config');
//const { HttpError } = require('../tools');

const checkToken = shouldProtect => {
  return async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await db.users.findById(payload._id)
        .select('-__v -createdAt -updatedAt');
      if (user) {
        req.user = user;
        return next();
      }
      else if (shouldProtect)
        return res.status(401).end();
      return next();
    } catch (error) {
      if (shouldProtect)
        return res.status(401).end(); 
      return next();
    }
  }
}

const getAuthState = (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({ isLoggedIn: false });
    return res.status(200).json({ isLoggedIn: true });
  } catch (error) {
    return res.status(200).json({ isLoggedIn: false });
  }
}

const authenticateWithCredentials = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).json({ error: 'Missing credentials' });
    const user = await db.users.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Wrong email or password' });
    else if (!user.comparePassword(password))
      return res.status(401).json({ error: 'Wrong email or password' });
    else
      return res.status(200).json({
        token: user.genToken()
      });
  } catch (error) {
    return res.status(500).end();
  }
}

//const logOut = (req, res)

module.exports = {
  checkToken,
  getAuthState,
  authenticateWithCredentials
};