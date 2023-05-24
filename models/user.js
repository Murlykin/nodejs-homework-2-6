const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 3,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);
const User = model('user', userSchema);
const registerSchema = Joi.object({
  password: Joi.string().min(3).required(),
  email: Joi.string().required(),
 });

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

module.exports = {
    User,
    schemas,
};