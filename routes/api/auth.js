const express = require("express");

const validateBody = require("../../middlewares/validateBody");
const upload = require("../../middlewares/upload");
const ctrl = require("../../controllers/auth/auth");

const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.registerSchema), ctrl.login);

router.get("/current", authenticate, ctrl.current);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/users",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.subscription
);

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post('/verify', ctrl.resendEmail);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.avatar);

module.exports = router;
