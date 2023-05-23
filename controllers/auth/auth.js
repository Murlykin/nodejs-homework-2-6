const bcrypt = require('bcrypt');

require('dotenv').config();

const { User } = require('../../models/user');

const { ctrlWrapper, HttpError} = require('../../helpers');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, `email: '${email}' already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

module.exports = {
    register: ctrlWrapper(register),
};