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
