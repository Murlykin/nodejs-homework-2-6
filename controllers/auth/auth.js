const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const { SECRET_KEY } = process.env;

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

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token: token,
    
    });
};
const current = async (req, res ) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.json({
        message: 'logout sucsses',
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
};