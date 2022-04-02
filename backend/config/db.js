const mongoose = require("mongoose");
const { Schema, model, connect } = mongoose;
const localDB = "mongodb://localhost:27017/cloudinaryDemo";
const remoteDB = process.env.REMOTE_DB;
function dbConnect() {
  try {
    connect(remoteDB || localDB, () => console.log("DB CONNECTED"));
  } catch (error) {
    throw error;
  }
}

const ImageSchema = new Schema({
  images: Array,
});
const ImageModel = model("Image", ImageSchema);

module.exports = { dbConnect, ImageModel };
