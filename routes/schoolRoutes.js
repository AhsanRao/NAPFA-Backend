const express = require("express");
const router = express.Router();

// Create a new school
router.post("/", async (req, res) => {
  try {
    const { schoolName, email } = req.body;
    const schoolRef = await req.db
      .collection("Schools")
      .add({ schoolName, email });
    res.status(201).send({ id: schoolRef.id, schoolName, email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new school admin portal
router.post("/admin", async (req, res) => {
    try {
      const { schoolName, email, createDefaultLicenses } = req.body;
      const schoolRef = await req.db.collection("Schools").add({ schoolName, email });
  
      if (createDefaultLicenses) {
        const licensesRef = schoolRef.collection("Licenses");
        const licenseRef = await licensesRef.add({
          issuedDate: new Date().toISOString(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          status: "active",
          deviceName: "",
        });
      }
  
      res.status(201).send({ id: schoolRef.id, schoolName, email });
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(500).send({ message: error.message });
    }
  });  

// Get all schools
router.get("/", async (req, res) => {
  try {
    const snapshot = await req.db.collection("Schools").get();
    const schools = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(schools);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all schools with license count and status
router.get("/admin", async (req, res) => {
  try {
    const schoolsSnapshot = await req.db.collection("Schools").get();
    const schools = [];

    for (const schoolDoc of schoolsSnapshot.docs) {
      const schoolData = schoolDoc.data();
      const licensesSnapshot = await schoolDoc.ref.collection("Licenses").get();
      const licenseCount = licensesSnapshot.size;
      const allLicensesActive =
        licenseCount > 0 &&
        licensesSnapshot.docs.every(
          (licenseDoc) => licenseDoc.data().status === "active"
        );

      schools.push({
        id: schoolDoc.id,
        name: schoolData.schoolName,
        email: schoolData.email,
        licenses: licenseCount,
        allLicensesActive: licenseCount === 0 ? false : allLicensesActive,
      });
    }

    res.status(200).send(schools);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a school by ID
router.get("/:id", async (req, res) => {
  try {
    const schoolRef = req.db.collection("Schools").doc(req.params.id);
    const doc = await schoolRef.get();
    if (!doc.exists) {
      res.status(404).send("School not found");
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a school by ID
router.put("/:id", async (req, res) => {
  try {
    const { schoolName, email } = req.body;
    const schoolRef = req.db.collection("Schools").doc(req.params.id);
    await schoolRef.update({ schoolName, email });
    res.status(200).send({ id: req.params.id, schoolName, email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a school by ID
router.delete("/:id", async (req, res) => {
  try {
    const schoolRef = req.db.collection("Schools").doc(req.params.id);
    await schoolRef.delete();
    res.status(200).send("School deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
