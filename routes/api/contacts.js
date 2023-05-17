const express = require("express");
const {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
} = require("../../controllers/contactControllers");
const {
  noBody ,
  validateBody,
 
} = require('../../middlewares/middlewares'); 


const router = express.Router();

router.get("/", getContact);

router.get("/:contactId", getById);

router.post("/", noBody, validateBody, postContact);

router.delete("/:contactId", deleteContactById);

router.put("/:contactId", noBody, validateBody, changeContactById);

module.exports = router;
