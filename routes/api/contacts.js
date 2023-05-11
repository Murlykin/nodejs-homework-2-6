const express = require("express");
const {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
} = require("../../controllers/contactControllers");

const router = express.Router();

router.get("/", getContact);

router.get("/:contactId", getById);

router.post("/", postContact);

router.delete("/:contactId", deleteContactById);

router.put("/:contactId", changeContactById);

module.exports = router;
