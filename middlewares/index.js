const validateBody = require("./validateBody");
const isValidId = require("./middlewares");
const noBody = require("./middlewares");
const validateFavorite = require("./middlewares");
const authenticate = require("./middlewares");
const upload = require('./upload');

module.exports = {
  validateBody,
  isValidId,
  noBody,
  validateFavorite,
  authenticate,
  upload,
};
