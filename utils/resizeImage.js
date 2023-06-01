const Jimp = require("jimp");

const resizeImage = async (pathToImage, width, height) => {
  const image = await Jimp.read(pathToImage);
  await image.resize(Number(width), Number(height));
  await image.writeAsync(pathToImage);
};

module.exports = { resizeImage };
