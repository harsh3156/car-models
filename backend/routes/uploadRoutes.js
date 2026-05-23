const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required." });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { imageUrl } });
});

module.exports = router;
