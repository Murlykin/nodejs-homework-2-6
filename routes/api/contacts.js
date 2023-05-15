const express = require("express");
const {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
} = require("../../controllers/contactControllers");
const {
  addContactValidation,
 
} = require('../../utils/contactAddScema') 


const router = express.Router();

router.get("/", getContact);

router.get("/:contactId", getById);

router.post("/", addContactValidation, postContact);

router.delete("/:contactId", deleteContactById);

router.put("/:contactId", changeContactById);

module.exports = router;
