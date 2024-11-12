const { signup, signin } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const 
router = require('express').Router();

router.post('/signin', loginValidation, signin);
router.post('/signup', signupValidation, signup);

module.exports = router;