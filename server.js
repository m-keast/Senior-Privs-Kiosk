const config = require("dotenv").config();
// Setup express server
const express = require("express");
const path = require("path");
const app = express();
// Provide a default port
const PORT = process.env.PORT;

// --- IMPORT ROUTERS ---
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Serve static files from the public directory
app.set("view engine", "ejs");
app.use(express.static("static"));

// --- MOUNT ROUTERS ---
// Any request starting with /api will be handled by apiRoutes
app.use('/api', apiRoutes);

// Any request starting with /admin will be handled by adminRoutes
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});