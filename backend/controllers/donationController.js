const db = require("../config/db");

// CREATE Donation
exports.createDonation = (req, res) => {
  const { donor_name, amount, donation_date } = req.body;

  // Basic validation
  if (!donor_name || !amount || !donation_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  const query = `
    INSERT INTO donations (donor_name, amount, donation_date)
    VALUES (?, ?, ?)
  `;

  db.query(query, [donor_name, amount, donation_date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Donation added successfully",
      donationId: result.insertId,
    });
  });
};
exports.getAllDonations = (req, res) => {
  const query = "SELECT * FROM donations ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};
// UPDATE Donation
exports.updateDonation = (req, res) => {
  const { id } = req.params;
  const { donor_name, amount, donation_date } = req.body;

  if (!donor_name || !amount || !donation_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  const query = `
    UPDATE donations 
    SET donor_name = ?, amount = ?, donation_date = ?
    WHERE id = ?
  `;

  db.query(query, [donor_name, amount, donation_date, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation updated successfully" });
  });
};
// DELETE Donation
exports.deleteDonation = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM donations WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  });
};