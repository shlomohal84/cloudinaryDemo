const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const localDB = "mongodb://localhost:27017/cloudinaryDemo";
const remoteDB = process.env.REMOTE_DB;
const { cloudinary } = require("./utils/cloudinary");
const ImageModel = require("./config/db");

const dbConnect = async () => {
  try {
    await mongoose.connect(/* remoteDB || */ localDB, {
      connectTimeoutMS: 5000,
    });
    console.log("DB CONNECTED");
  } catch (error) {
    throw error;
  }
};
dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.resolve(__dirname, "./frontend/build")));

app.get("/api/images", async (req, res) => {
  try {
    const images = await ImageModel.find().sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    throw error;
  }
});

app.delete("/api/images", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.body.data);
    const pubId = image.images[0].public_id;
    const deleteResponse = await cloudinary.uploader.destroy(pubId);
    if (deleteResponse) {
      await ImageModel.findByIdAndDelete(req.body.data);
    }
    console.log("deleted");
    res.json(image);
  } catch (error) {
    throw error;
  }
});

app.post("/api/upload", async (req, res) => {
  try {
    if (!(await ImageModel.find())) return;
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "1st_demo",
      use_filename: true,
      unique_filename: false,
    });
    if (uploadedResponse) {
      const image = await ImageModel.create({ images: uploadedResponse });
      image.save();
    }

    res.json({ message: "YAAAAY" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OH DUKES!" });
  }
});
app.listen(port, () => console.log(`Backend Loaded on port ${port}`));
