const Joi = require("joi");

const addScema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
   
}
);

module.exports = {
  addScema
};
