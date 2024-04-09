const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
}).required();
