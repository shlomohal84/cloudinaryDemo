const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.SERVER_PORT || 5000;
const { cloudinary } = require("./utils/cloudinary");
const { dbConnect, ImageModel } = require("./config/db");
dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/api/images", async (req, res) => {
  try {
    const images = await ImageModel.find().sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
});

app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
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
