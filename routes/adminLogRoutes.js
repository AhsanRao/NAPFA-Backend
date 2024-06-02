const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("firebase-admin");

// Create a new admin log for a school
router.post("/", async (req, res) => {
  try {
    const { action, timestamp, details } = req.body;
    const currentTimestamp =
      timestamp || admin.firestore.FieldValue.serverTimestamp();
    const adminLogRef = await req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("AdminLogs")
      .add({
        action,
        timestamp: currentTimestamp,
        details,
      });
    res
      .status(201)
      .send({
        id: adminLogRef.id,
        action,
        timestamp: currentTimestamp,
        details,
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all admin logs for a school
router.get("/", async (req, res) => {
  try {
    const snapshot = await req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("AdminLogs")
      .get();
    const adminLogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(adminLogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get an admin log by ID for a school
router.get("/:logId", async (req, res) => {
  try {
    const adminLogRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("AdminLogs")
      .doc(req.params.logId);
    const doc = await adminLogRef.get();
    if (!doc.exists) {
      res.status(404).send("Admin log not found");
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an admin log by ID for a school
router.put("/:logId", async (req, res) => {
  try {
    const { action, timestamp, details } = req.body;

    const updateData = {};
    if (action !== undefined) updateData.action = action;
    if (timestamp !== undefined) updateData.timestamp = timestamp;
    if (details !== undefined) updateData.details = details;

    const adminLogRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("AdminLogs")
      .doc(req.params.logId);
    await adminLogRef.update(updateData);
    res.status(200).send({ id: req.params.logId, ...updateData });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an admin log by ID for a school
router.delete("/:logId", async (req, res) => {
  try {
    const adminLogRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("AdminLogs")
      .doc(req.params.logId);
    const adminLogDoc = await adminLogRef.get();

    if (!adminLogDoc.exists) {
      return res.status(404).send("Admin log not found");
    }

    await adminLogRef.delete();
    res.status(200).send("Admin log deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
