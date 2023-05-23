const express = require("express");
const {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
  updateStatusContact,
} = require("../../controllers/contactControllers");
const { isValidId, validateFavorite, noBody } = require("../../middlewares/middlewares")

const validateBody = require("../../middlewares/validateBody")


const router = express.Router();

router.get("/", getContact);

router.get("/:contactId", isValidId, getById);

router.post("/", noBody, validateBody,  postContact);

router.delete("/:contactId", deleteContactById);

router.put("/:contactId", noBody, isValidId, validateBody,  changeContactById);

router.patch("/:contactId/favorite", validateFavorite, isValidId, updateStatusContact);

module.exports = router;
