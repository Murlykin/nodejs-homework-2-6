const Joi = require("joi");

const addScema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
const validate = (schema, res, obj, next) => {
  const validationLogs = schema.validate(obj)

  if (validationLogs.error) {
    return res.status(400).json({ message: validationLogs.error.message.replace(/"/g, '') })
  }
  next()
}

module.exports = {
  addScema,
 addContactValidation: (req, res, next) => {
    return validate( addScema, res, req.body, next)
  }};
