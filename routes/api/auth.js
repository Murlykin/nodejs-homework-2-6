const express = require('express');

const  validateBody  = require('../../middlewares/validateBody');

const ctrl = require('../../controllers/auth/auth');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

module.exports = router;