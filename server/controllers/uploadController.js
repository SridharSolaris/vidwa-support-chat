const Faq = require("../models/faq");
const fs = require("fs");
const pdf = require("pdf-parse");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    let content = "";
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);
      content = data.text;
    } else {
      content = fs.readFileSync(req.file.path, "utf-8");
    }

    const newFaq = new Faq({
      filename: req.file.originalname,
      content: content,
    });

    await newFaq.save();
    fs.unlinkSync(req.file.path); // Clean up the uploaded file

    res.json({ message: "File uploaded and processed successfully." });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file." });
  }
};
