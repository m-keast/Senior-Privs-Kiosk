const express = require("express");
const router = express.Router();
const db = require("../db.js"); // Import the database module
const API_BASE_URL = process.env.API_URL;

// GET /admin
router.get("/", async (req, res) => {
  const recordperpage = 17;
  const currentPage = parseInt(req.query.page) || 1;
  const searchTerm = req.query.search || "";
  const sortBy = req.query.sort || "timestamp";
  const sortOrder = req.query.order || "DESC";

  let whereClauses = [];
  let queryParams = [];
  let paramIndex = 1;

  if (searchTerm) {
    whereClauses.push(
      `("studentName" ILIKE $${paramIndex})`
    );
    queryParams.push(`%${searchTerm}%`);
    paramIndex++;
  }

  const whereString =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const allowedSortColumns = [
    "studentName",
    "status",
    "timestamp",
  ];
  const safeSortBy = allowedSortColumns.includes(sortBy)
    ? `"${sortBy}"`
    : '"timestamp"';
  const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  try {
    const countQuery = `SELECT COUNT(*) FROM "tblCheckIns" ${whereString}`;
    const totalResult = await db.query(countQuery, queryParams);
    const totalRecords = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / recordperpage);

    const offset = (currentPage - 1) * recordperpage;
    queryParams.push(recordperpage, offset);

    //Fine that these fields are publicly visible on the /admin route
    const dataQuery = `
            "studentName" AS "Student Name", status AS "Last Activity", timestamp
            FROM "tblCheckIns"
            ${whereString}
            ORDER BY ${safeSortBy} ${safeSortOrder}
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}
        `;

    const pageData = await db.query(dataQuery, queryParams);

    res.render("admin", {
      data: pageData.rows,
      currentPage,
      totalPages,
      searchTerm,
      sortBy,
      sortOrder,
    });
  } catch (error) {
    console.error("Error rendering admin page:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;