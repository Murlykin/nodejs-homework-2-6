const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const { addScema } = require("../utils/contactAddScema");
const { HttpError } = require("../helpers");

const getContact = async (req, res) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await getContactById(id);
    if (!result) {
   throw HttpError(404, "Not found!!");
    }
    res.json(result);
  } catch (error) {
   next(error);
   
  }
};

const postContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = { name, email, phone };
    const { error } = addScema.validate(newContact);

    if (error) {
      res.status(400).json({ message: "missing required name field" });
      return;
    }
    const result = await addContact(newContact);
    res.status(201).json(result);
  } catch (error) {
   next(error);
   
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
      return;
    }
    throw HttpError(404, "Not found!");
  } catch (error) {
     next(error);
  }
};

const changeContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    const result = await updateContact(contactId, body);
    if (!result) {
      throw HttpError(400, "missing fields");
    }
    res.status(200).json(result);
  } catch (error) {
     next(error);
    
  }
};

module.exports = {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
};
