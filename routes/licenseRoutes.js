const express = require("express");
const router = express.Router({ mergeParams: true });

// Create a new license for a school
router.post("/", async (req, res) => {
  try {
    const { status, issuedDate, expiryDate } = req.body;
    const licenseRef = await req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Licenses")
      .add({
        status,
        issuedDate,
        expiryDate,
        deviceName: "none", // Set default device name to "none"
      });
    res.status(201).send({
      id: licenseRef.id,
      status,
      issuedDate,
      expiryDate,
      deviceName: "none",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all licenses for a school
router.get("/", async (req, res) => {
  try {
    const snapshot = await req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Licenses")
      .get();
    const licenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(licenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a license by ID for a school
router.get("/:licenseId", async (req, res) => {
  try {
    const licenseRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Licenses")
      .doc(req.params.licenseId);
    const doc = await licenseRef.get();
    if (!doc.exists) {
      res.status(404).send("License not found");
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a license by ID for a school
router.put("/:licenseId", async (req, res) => {
  try {
    const { status, issuedDate, expiryDate } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (issuedDate !== undefined) updateData.issuedDate = issuedDate;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;

    const licenseRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Licenses")
      .doc(req.params.licenseId);
    await licenseRef.update(updateData);
    res.status(200).send({ id: req.params.licenseId, ...updateData });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a license by ID for a school
router.delete("/:licenseId", async (req, res) => {
  try {
    const licenseRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Licenses")
      .doc(req.params.licenseId);
    const licenseDoc = await licenseRef.get();

    if (!licenseDoc.exists) {
      return res.status(404).send("License not found");
    }

    await licenseRef.delete();
    res.status(200).send("License deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
