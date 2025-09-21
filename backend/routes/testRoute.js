const express = require("express");
const router = express.Router();

// ✅ Test API route
router.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

module.exports = router;
