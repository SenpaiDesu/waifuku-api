const db = require('../models');

const signUp = async (req, res) => {
  try {
    const user = await db.users.create(req.body);
    return res.status(200).json({
      token: user.genToken()
    });
  } catch (error) {
    return res.status(400).json(error);
  }
}

const getProfile = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).end();
  }
}

const updateProfile = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword)
      return res.status(422).json({ error: 'You must provide current password' });
    if (!req.user.comparePassword(currentPassword))
      return res.status(422).json({ error: 'Wrong current password' });
    for (let field in req.body)
      req.user[field] = req.body[field];
    return res.status(200).json(await req.user.save());
  } catch (error) {
    return res.status(400).json(error);
  }
}

module.exports = {
  signUp,
  getProfile,
  updateProfile
}