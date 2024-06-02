const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const schoolRoutes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const mockStudentRoutes = require("./routes/mockStudentRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const adminLogRoutes = require("./routes/adminLogRoutes");
const licenseUtils = require("./utils/licenseUtils");

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR_FIREBASE_PROJECT_ID>.firebaseio.com",
});

const db = admin.firestore();

// Make the db object available to the routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Routes will go here
app.use("/api/schools", schoolRoutes);
app.use("/api/schools/:schoolId/students", studentRoutes);
app.use("/api/schools/:schoolId/mock/students", mockStudentRoutes);
app.use("/api/schools/:schoolId/licenses", licenseRoutes);
app.use("/api/schools/:schoolId/adminlogs", adminLogRoutes);
app.use("/api/licenses", licenseUtils);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
