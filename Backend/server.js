const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Temple_database",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// 🔐 **Login Endpoint (No Hashing)**
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", role: user.role });
  });
});

// 🔄 **Password Update Endpoint (No Hashing)**
app.post("/update-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  const sqlSelect = "SELECT password FROM users WHERE username = ?";
  db.query(sqlSelect, [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const storedPassword = result[0].password;

    if (oldPassword !== storedPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    const sqlUpdate = "UPDATE users SET password = ? WHERE username = ?";
    db.query(sqlUpdate, [newPassword, username], (err) => {
      if (err) return res.status(500).json({ message: "Failed to update password" });
      res.json({ message: "Password updated successfully" });
    });
  });
});



// 🔹 API to Insert Pooja Data (Optional, if you want to add new pooja names)
app.post("/add-pooja", (req, res) => {
  const { poojaName, price } = req.body; // Accept price from request body

  // Validate input
  if (!poojaName || !price || isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ error: "⚠️ Pooja Name and valid Price are required" });
  }

  const query = "INSERT INTO pooja_names (name, price) VALUES (?, ?)";
  db.query(query, [poojaName, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Database error" });
    }
    res.status(201).json({ message: "🎉 Pooja added successfully", poojaName, price });
  });
});


// 🔹 API to Fetch Pooja Names with Prices
app.get("/get-pooja-names", (req, res) => {
  const query = "SELECT name, price FROM pooja_names"; // Include price in the query
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Error fetching pooja names" });
    }
    res.status(200).json(result);
  });
});


// 🔹 API to Fetch Devotees (For Autocomplete)
app.get("/search-devotees", (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).json({ error: "⚠️ Search query required" });
  }

  const query = `
    SELECT id, name, parent_name, dob, mobile, email, pincode, address, zone, head_of_house
    FROM devotees 
    WHERE name LIKE ? 
    LIMIT 20
  `;

  db.query(query, [`%${searchQuery}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Database error" });
    }
    res.status(200).json(result);
  });
});


app.post("/register-pooja", (req, res) => {
  const { devoteeId, devoteeName, poojaName, poojaDate, tithi } = req.body;

  if (!devoteeId || !poojaName || !poojaDate) {
    return res.status(400).json({ error: "⚠️ Devotee ID, Pooja Name, and Pooja Date are required" });
  }

  // Check if Devotee exists
  db.query("SELECT * FROM devotees WHERE id = ?", [devoteeId], (err, devoteeResult) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Database error while checking devotee" });
    }
    if (devoteeResult.length === 0) {
      return res.status(400).json({ error: "⚠️ Devotee does not exist" });
    }

    // Check if Pooja Name exists
    db.query("SELECT * FROM pooja_names WHERE name = ?", [poojaName], (err, poojaResult) => {
      if (err) {
        return res.status(500).json({ error: "⚠️ Database error while checking pooja name" });
      }
      if (poojaResult.length === 0) {
        return res.status(400).json({ error: "⚠️ Pooja Name does not exist" });
      }

      // Insert into pooja_registration (including all fields)
      const query = `
        INSERT INTO poojaregistration (
          devotee_id, devotee_name, pooja_name, pooja_date, tithi
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      // If tithi is not provided, send NULL to the database
      db.query(query, [devoteeId, devoteeName, poojaName, poojaDate, tithi || null], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "⚠️ Database error during insertion" });
        }
        res.status(201).json({ message: "🎉 Pooja registered successfully" });
      });
    });
  });
});


app.post("/register-devotee", (req, res) => {
  const { 
    name, parentName, dob, mobile, email, pincode, zone, 
    address1, address2, address3, address4, 
    rashi, nakshatra, gotra, headOfHouse // Added headOfHouse
  } = req.body;

  if (!name || !parentName || !dob || !mobile || !pincode || !zone) {
    return res.status(400).json({ error: "⚠️ All required fields must be filled" });
  }

  if (!/^\d{10,15}$/.test(mobile)) {
    return res.status(400).json({ error: "⚠️ Invalid mobile number format" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({ error: "⚠️ Invalid date format (Use YYYY-MM-DD)" });
  }

  const fullAddress = [address1, address2, address3, address4].filter(Boolean).join(", ");

  const query = `
    INSERT INTO devotees (name, parent_name, dob, mobile, email, pincode, address, zone, rashi, nakshatra, gotra, head_of_house)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, parentName, dob, mobile, email, pincode, fullAddress, zone, rashi, nakshatra, gotra, headOfHouse], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "⚠️ Mobile number or email already exists" });
      }
      console.error("❌ Database Insert Error:", err);
      return res.status(500).json({ error: "⚠️ Error inserting devotee" });
    }
    res.status(201).json({ message: "🎉 Devotee registered successfully", devoteeId: result.insertId });
  });
});

// 🔹 API to Insert Zone Data (Add Zone)
app.post("/add-zone", (req, res) => {
  const { zoneName } = req.body;

  if (!zoneName) {
    return res.status(400).json({ error: "⚠️ Zone Name is required" });
  }

  const query = "INSERT INTO zone (name) VALUES (?)";
  db.query(query, [zoneName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Error inserting zone" });
    }
    res.status(201).json({ message: "🎉 Zone added successfully", zoneName });
  });
});

// 🔹 API to Fetch All Zones
app.get("/get-zones", (req, res) => {
  const query = "SELECT * FROM zone";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Error fetching zones" });
    }
    res.status(200).json(result);
  });
});

// GET Route to retrieve registrations by specific date range
app.get("/api/pooja_registrations", (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "⚠️ Start Date and End Date are required" });
  }

  // Normalize the start and end dates to ignore the time component
  const formattedStartDate = new Date(startDate);
  formattedStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for start date
  
  const formattedEndDate = new Date(endDate);
  formattedEndDate.setHours(23, 59, 59, 999); // Set time to 23:59:59 for end date

  // Debug log to verify the dates
  console.log("Start Date:", formattedStartDate);
  console.log("End Date:", formattedEndDate);

  const query = `
    SELECT pr.id, d.name AS devotee_name, pr.pooja_name, pr.pooja_date, 
           d.mobile, d.address, d.pincode 
    FROM poojaregistration pr
    JOIN devotees d ON pr.devotee_id = d.id
    WHERE pr.pooja_date BETWEEN ? AND ? 
    ORDER BY pr.pooja_date ASC;
  `;

  db.query(query, [formattedStartDate, formattedEndDate], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "⚠️ Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "⚠️ No registrations found for the selected dates" });
    }

    res.json(results);
  });
});


// API to search zones by name (live search)
app.get("/api/search-zones", (req, res) => {
  const searchQuery = req.query.q;  // Get the search query parameter

  if (!searchQuery) {
    return res.status(400).json({ error: "⚠️ Search query is required" });
  }

  const query = "SELECT * FROM zone WHERE name LIKE ?";
  db.query(query, [`%${searchQuery}%`], (err, result) => {
    if (err) {
      console.error("⚠️ Error fetching zones:", err);
      return res.status(500).json({ error: "⚠️ Error fetching zones" });
    }
    res.status(200).json(result);  // Send the matching zones back to the frontend
  });
});


app.delete("/api/delete/zone/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete zone with ID: ${id}`);  // Debugging log

  const query = "DELETE FROM zone WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting zone:", err);  // More detailed error log
      return res.status(500).json({ error: "Failed to delete zone" });
    }

    if (result.affectedRows === 0) {
      // If no rows were affected, that means the zone ID doesn't exist
      console.log(`No zone found with ID: ${id}`);
      return res.status(404).json({ error: "Zone not found" });
    }

    res.json({ message: "Zone deleted successfully!" });
  });
});

// API to search pooja names
app.get("/api/search-pooja-names", (req, res) => {
  const searchQuery = req.query.q;  // Get the search query parameter

  if (!searchQuery) {
    return res.status(400).json({ error: "⚠️ Search query is required" });
  }

  const query = "SELECT * FROM pooja_names WHERE name LIKE ?";
  db.query(query, [`%${searchQuery}%`], (err, result) => {
    if (err) {
      console.error("⚠️ Error fetching pooja names:", err);
      return res.status(500).json({ error: "⚠️ Error fetching pooja names" });
    }
    res.status(200).json(result);  // Send the matching pooja names back to the frontend
  });
});

// API to delete pooja name
app.delete("/api/delete/pooja-name/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pooja_names WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("⚠️ Error deleting pooja name:", err);
      return res.status(500).json({ error: "⚠️ Error deleting pooja name" });
    }
    res.status(200).json({ message: "Pooja name deleted successfully" });
  });
});


// API to search devotees
app.get("/api/search-devotees", (req, res) => {
  const searchQuery = req.query.q;  // Get the search query parameter

  if (!searchQuery) {
    return res.status(400).json({ error: "⚠️ Search query is required" });
  }

  const query = "SELECT id, name FROM devotees WHERE name LIKE ?";
  db.query(query, [`%${searchQuery}%`], (err, result) => {
    if (err) {
      console.error("⚠️ Error fetching devotees:", err);
      return res.status(500).json({ error: "⚠️ Error fetching devotees" });
    }
    res.status(200).json(result);  // Send the matching devotees back to the frontend
  });
});

// API to delete devotee
app.delete("/api/delete/devotee/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM devotees WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("⚠️ Error deleting devotee:", err);
      return res.status(500).json({ error: "⚠️ Error deleting devotee" });
    }
    res.status(200).json({ message: "Devotee deleted successfully" });
  });
});



 

// Search Pooja Registrations
app.get("/api/search-pooja-registrations", (req, res) => {
  const searchQuery = req.query.q;
  const searchType = req.query.type; // devotee_name, devotee_id, or pooja_date

  console.log("Received search query:", searchQuery, "Type:", searchType);

  if (!searchQuery) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  let query;
  let values;

  if (searchType === "devotee_name") {
    query = "SELECT * FROM PoojaRegistration WHERE devotee_name LIKE ?";
    values = [`%${searchQuery}%`];
  } else if (searchType === "devotee_id") {
    query = "SELECT * FROM PoojaRegistration WHERE devotee_id = ?";
    values = [searchQuery];
  } else if (searchType === "pooja_date") {
    query = "SELECT * FROM PoojaRegistration WHERE DATE(pooja_date) = ?";
    values = [searchQuery]; // MySQL date format (YYYY-MM-DD)
  } else {
    return res.status(400).json({ error: "Invalid search type" });
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
    console.log("Fetched results:", results);
    res.json(results);
  });
});

// Delete Pooja Registration
app.delete("/api/delete/pooja-registration/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM PoojaRegistration WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting pooja registration:", err);
      return res.status(500).json({ error: "Error deleting pooja registration" });
    }
    res.json({ message: "Pooja registration deleted successfully" });
  });
});



// ✅ **Delete Pooja Registration by ID**
app.delete("/api/delete/pooja-registration/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM poojaregistration WHERE id = ?";
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting pooja registration:", err);
      return res.status(500).json({ error: "Database deletion failed" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pooja registration not found" });
    }
    
    res.json({ message: "Pooja registration deleted successfully" });
  });
});

app.get("/devotees", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "⚠️ Name query parameter is required" });
  }

  const query = `SELECT id, name, parent_name, dob, mobile, email, pincode, zone, address, rashi, nakshatra, gotra 
                 FROM devotees WHERE name LIKE ?`;

  db.query(query, [`%${name}%`], (err, results) => {
    if (err) {
      console.error("❌ Database Fetch Error:", err);
      return res.status(500).json({ error: "⚠️ Error fetching devotees" });
    }
    res.json(results);
  });
});


app.put("/devotees/:id", (req, res) => {
  const { id } = req.params;
  const { 
    name, parent_name, dob, mobile, email, pincode, zone, 
    address1, address2, address3, address4, rashi, nakshatra, gotra, head_of_house
  } = req.body;

  if (!name || !parent_name || !dob || !mobile || !pincode || !zone) {
    return res.status(400).json({ error: "⚠️ All required fields must be filled" });
  }

  if (!/^\d{10,15}$/.test(mobile)) {
    return res.status(400).json({ error: "⚠️ Invalid mobile number format" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({ error: "⚠️ Invalid date format (Use YYYY-MM-DD)" });
  }

  const fullAddress = [address1, address2, address3, address4].filter(Boolean).join(", ");

  const query = `
    UPDATE devotees 
    SET name=?, parent_name=?, dob=?, mobile=?, email=?, pincode=?, zone=?, address=?, rashi=?, nakshatra=?, gotra=?, head_of_house=? 
    WHERE id=?
  `;

  db.query(query, [name, parent_name, dob, mobile, email, pincode, zone, fullAddress, rashi, nakshatra, gotra, head_of_house, id], (err, result) => {
    if (err) {
      console.error("❌ Database Update Error:", err);
      return res.status(500).json({ error: "⚠️ Error updating devotee" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "⚠️ Devotee not found" });
    }

    res.json({ message: "✅ Devotee updated successfully" });
  });
});




// 🔹 API to Fetch Devotees by Zone
app.get("/get-devotees", (req, res) => {
  const { zone } = req.query;
  if (!zone) {
    return res.status(400).json({ error: "⚠️ Zone parameter is required" });
  }

  const query = "SELECT * FROM devotees WHERE head_of_house='yes' and  zone = ?";
  db.query(query, [zone], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "⚠️ Error fetching devotees" });
    }
    res.status(200).json(result);
  });
});




// 📌 API to Fetch Regular Pooja List Based on Date Range
app.get("/regular-pooja-list", (req, res) => {
  const { start_date, end_date } = req.query;

  // Validate input
  if (!start_date || !end_date) {
    return res.status(400).json({ error: "Start date and end date are required" });
  }

  const query = `
    SELECT pr.id, d.name, pr.pooja_name, DATE(pr.pooja_date) AS pooja_date, 
           d.rashi, d.nakshatra, d.gotra
    FROM PoojaRegistration pr
    JOIN devotees d ON pr.devotee_id = d.id
    WHERE DATE(pr.pooja_date) BETWEEN ? AND ?;
  `;

  db.query(query, [start_date, end_date], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


 

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


