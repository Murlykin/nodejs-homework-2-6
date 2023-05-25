const express = require("express");
const {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
  updateStatusContact,
} = require("../../controllers/contact/contactControllers");
const {
  isValidId,
  validateFavorite,
  noBody,
} = require("../../middlewares/middlewares");

const validateBody = require("../../middlewares/validateBody");
const { authenticate } = require("../../middlewares/authenticate");
const { schemas } = require("../../utils/contactAddScema");

const router = express.Router();

router.get("/", authenticate, getContact);

router.get("/:contactId", authenticate, isValidId, getById);

router.post(
  "/",
  authenticate,
  noBody,
  validateBody(schemas.addScema),
  postContact
);

router.delete("/:contactId", authenticate, deleteContactById);

router.put(
  "/:contactId",
  authenticate,
  noBody,
  isValidId,
  validateBody(schemas.addScema),
  changeContactById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateFavorite,
  isValidId,
  updateStatusContact
);

module.exports = router;
