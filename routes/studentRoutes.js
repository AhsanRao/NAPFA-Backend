const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require('firebase-admin');

// Helper function to remove undefined values from an object
const removeUndefined = (obj) => 
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

// Create or update multiple students
router.post('/', async (req, res) => {
  try {
    const students = Array.isArray(req.body) ? req.body : [req.body];
    const schoolId = req.params.schoolId;
    const batch = req.db.batch();

    // Get all student IDs
    const studentIds = students.map(student => student.id || req.db.collection('Schools').doc().id);

    // Fetch all existing documents in one query
    const studentsRef = req.db.collection('Schools').doc(schoolId).collection('Students');
    const existingDocs = await studentsRef.where(admin.firestore.FieldPath.documentId(), 'in', studentIds).get();

    const existingDocsMap = new Map();
    existingDocs.forEach(doc => existingDocsMap.set(doc.id, doc));

    students.forEach((student, index) => {
      const {
        id,
        no,
        name,
        class: studentClass,
        gender,
        dob,
        attendanceStatus,
        sitUpReps,
        broadJumpCm,
        sitAndReachCm,
        pullUpReps,
        shuttleRunSec,
        runTime,
        pftTestDate,
        uploadDate
      } = student;

      const studentId = studentIds[index];
      const currentUploadDate = uploadDate || admin.firestore.FieldValue.serverTimestamp();
      const studentRef = studentsRef.doc(studentId);

      if (existingDocsMap.has(studentId)) {
        // Document exists, update only non-negative values
        const updateData = removeUndefined({
          no,
          name,
          class: studentClass,
          gender,
          dob,
          attendanceStatus,
          sitUpReps: sitUpReps !== -1 ? sitUpReps : undefined,
          broadJumpCm: broadJumpCm !== -1 ? broadJumpCm : undefined,
          sitAndReachCm: sitAndReachCm !== -1 ? sitAndReachCm : undefined,
          pullUpReps: pullUpReps !== -1 ? pullUpReps : undefined,
          shuttleRunSec: shuttleRunSec !== -1 ? shuttleRunSec : undefined,
          runTime: runTime !== -1 ? runTime : undefined,
          pftTestDate,
          uploadDate: currentUploadDate
        });
        batch.update(studentRef, updateData);
      } else {
        // Document doesn't exist, add all data
        const newStudentData = removeUndefined({
          no,
          name,
          class: studentClass,
          gender,
          dob,
          attendanceStatus,
          sitUpReps,
          broadJumpCm,
          sitAndReachCm,
          pullUpReps,
          shuttleRunSec,
          runTime,
          pftTestDate,
          uploadDate: currentUploadDate
        });
        batch.set(studentRef, newStudentData);
      }
    });

    await batch.commit();
    res.status(201).send({ message: 'Students added/updated successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all students in a school
router.get("/", async (req, res) => {
  try {
    const snapshot = await req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Students")
      .get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a student by ID
router.get("/:id", async (req, res) => {
  try {
    const studentRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Students")
      .doc(req.params.id);
    const doc = await studentRef.get();
    if (!doc.exists) {
      res.status(404).send("Student not found");
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a student by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      no,
      name,
      class: studentClass,
      gender,
      dob,
      attendanceStatus,
      sitUpReps,
      broadJumpCm,
      sitAndReachCm,
      pullUpReps,
      shuttleRunSec,
      runTime,
      pftTestDate,
      uploadDate,
    } = req.body;

    const updateData = {};
    if (no !== undefined) updateData.no = no;
    if (name !== undefined) updateData.name = name;
    if (studentClass !== undefined) updateData.class = studentClass;
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = dob;
    if (attendanceStatus !== undefined)
      updateData.attendanceStatus = attendanceStatus;
    if (sitUpReps !== undefined) updateData.sitUpReps = sitUpReps;
    if (broadJumpCm !== undefined) updateData.broadJumpCm = broadJumpCm;
    if (sitAndReachCm !== undefined) updateData.sitAndReachCm = sitAndReachCm;
    if (pullUpReps !== undefined) updateData.pullUpReps = pullUpReps;
    if (shuttleRunSec !== undefined) updateData.shuttleRunSec = shuttleRunSec;
    if (runTime !== undefined) updateData.runTime = runTime;
    if (pftTestDate !== undefined) updateData.pftTestDate = pftTestDate;
    if (uploadDate !== undefined) updateData.uploadDate = uploadDate;

    const studentRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Students")
      .doc(req.params.id);
    await studentRef.update(updateData);
    res.status(200).send({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    const studentRef = req.db
      .collection("Schools")
      .doc(req.params.schoolId)
      .collection("Students")
      .doc(req.params.id);
    await studentRef.delete();
    res.status(200).send("Student deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
