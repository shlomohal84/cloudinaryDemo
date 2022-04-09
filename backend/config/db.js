const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({
  images: Array,
});

module.exports = model("Image", ImageSchema);
