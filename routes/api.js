const express = require("express");
const router = express.Router();
const db = require("../db.js"); // Import the database module
const API_BASE_URL = process.env.API_URL;

// POST /api/checkin
router.post("/checkin", express.json(), async (req, res) => {
  const { studentId, status } = req.body;
  const column = "lunchnumber";
  const value = studentId;

  // Validate user entry
  if (studentId.length !== 5 || isNaN(studentId)) {
    return res.json({ error: "Invalid student id, please try again." }); // Exit function
  }

  try {
    const headers = {
      "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET,
    };
    const params = new URLSearchParams({ column, value });
    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `Student data API responded with status ${response.status}`
      );
    }

    const apiResponse = await response.json();
    console.log(apiResponse.fullname);

    // Split the full name at the first space
    const fullNameParts = apiResponse.fullname.split(" ");
    const firstName = fullNameParts[0];

    // Capitalize the first name
    const capitalizedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);

    const capitalizedFullname = apiResponse.fullname
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    await insertCheckin(studentId, status, capitalizedFullname);

    return res.json({ studentName: capitalizedFirstName });
  } catch (err) {
    console.error("Error fetching data from the Student Data API:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

async function insertCheckin(studentId, status, studentname) {
  const query =
    'INSERT INTO "tblCheckIns" ("studentID", status, "studentName") VALUES ($1, $2, $3)';
  const values = [studentId, status, studentname];
  try {
    const res = await db.query(query, values);
    console.log("Check-in recorded:", res.rowCount);
  } catch (err) {
    console.error("Error inserting check-in:", err.stack);
  }
}

module.exports = router;