const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

const downloadQrSvg = asyncHandler(async (req, res) => {
  const { svgData } = req.body;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgData);
});

module.exports = { uploadLogo, downloadQrSvg };
