const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const { addScema, updateScema } = require("../utils/contactAddScema");

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

const getById = async (req, res) => {
  try {
    const id = req.params.contactId;
    const result = await getContactById(id);
    if (!result) {
      return res.status(404).json({
        message: `Not found ${id}`,
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const postContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = { name, email, phone };
    const { error } = addScema.validate(newContact);

    if (error) {
      res.status(400).json({ message: "missing required name field" });
      return;
    }
    const result = await addContact(newContact);
    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
      return;
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const changeContactById = async (req, res) => {
  try {
    const { contactId } = req.params;

    const body = req.body;
    if (!body) {
      return res.status(400).json({ message: "missing fields" });
    }

    const { error } = updateScema.validate(body);
    if (error) {
      return res.status(400).json({ message: "error in the fields" });
    }

    const result = await updateContact(contactId, body);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getContact,
  getById,
  postContact,
  deleteContactById,
  changeContactById,
};
