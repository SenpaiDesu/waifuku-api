const { Router } = require('express');
const ctrl = require('../controllers');
const {
  checkToken,
  authenticateWithCredentials,
  getAuthState
} = require('../services/auth.service');

const api = Router();

api
  .post('/signup', ctrl.users.signUp)
  .post('/signin', authenticateWithCredentials)
  .get('/me', checkToken(true), ctrl.users.getProfile)
  .get('/auth-state', checkToken(false), getAuthState)
  .put('/me', checkToken(true), ctrl.users.updateProfile)

module.exports = api;