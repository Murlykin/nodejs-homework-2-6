const Contact = require("../models/contact");
const {  favoriteSchema } = require("../utils/contactAddScema");
const { HttpError } = require("../helpers");

const getContact = async (req, res) => {
  const { _id: owner } = req.user;
  try {
    const result = await Contact.find({ owner });
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
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, "Not found!!");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const postContact  = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};


const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
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
    const result = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    const { error } = favoriteSchema.validate(body);

    if (error) {
      res
        .status(400)
        .json({ message: `missing field ${error.details[0].path[0]} ` });
      return;
    }

    const result = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
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
  updateStatusContact,
};
