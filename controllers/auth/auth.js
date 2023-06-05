const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { nanoid } = require('nanoid');

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require("../../models/user");
const { ctrlWrapper, HttpError } = require("../../helpers");
const gravatar = require("gravatar");
const { resizeImage } = require("../../utils/resizeImage");
const path = require("path");
const fs = require("fs/promises");
const sendEmail  = require('../../helpers/sendEmail');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, `email: '${email}' already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
        avatarURL: avatarURL,
        verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: 'verify email',
    html: `<p>Please confirm your account <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click</a></p>`,
  };

  await sendEmail(verifyEmail);
  
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, 'User not found ');
    }

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed ');
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: '',
    });

    res.json({
        message: 'Verification successful',
    });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, 'Missing required field email')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw HttpError(404, 'User not found')
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed')
  }

  const verifyEmail = {
    to: user.email,
    subject: 'Please Verify Your Email Identity',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Verify email identity</a>`,
  }

  await sendEmail(verifyEmail)

  res.status(201).json({
    message: 'Verification email sent',
  })
}


// const resendEmail = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw HttpError(401, "Email not found");
//   }

//   if (user.verify) {
//     throw HttpError(401, "Email already verify");
//   }

//   const verifyEmail = {
//     to: email,
//     subject: "verify email",
//     html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
//   };

//   await sendEmail(verifyEmail);

//   res.json({
//     message: "Verify email send success",
//   });
// };


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!updatedUser) {
    throw HttpError(404, "Not found");
  }

  const { email, subscription } = updatedUser;

  res.json({
    email,
    subscription,
  });
};

const avatarsDir = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  await resizeImage(resultUpload, 250, 250);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(updateSubscription),
  avatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendEmail: ctrlWrapper(resendEmail),
};
