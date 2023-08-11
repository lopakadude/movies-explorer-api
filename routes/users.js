const router = require('express').Router();
const celebrates = require('../middlewares/celebrates');
const {
  getCurrentUser, updateUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrates.updateUser, updateUserInfo);

module.exports = router;
