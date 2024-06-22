const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Check the status of a license key and update device name if valid
router.post('/check/:licenseKey', async (req, res) => {
  try {
    const licenseKey = req.params.licenseKey;
    const { deviceName } = req.body;
    let licenseDoc = null;
    let schoolId = null;
    let schoolName = null;
    let schoolEmail = null;

    // Query to find the license document by license key (document ID)
    const schoolsSnapshot = await req.db.collection('Schools').get();
    for (const schoolDoc of schoolsSnapshot.docs) {
      const licenseRef = schoolDoc.ref.collection('Licenses').doc(licenseKey);
      const licenseSnapshot = await licenseRef.get();
      if (licenseSnapshot.exists) {
        licenseDoc = licenseSnapshot;
        schoolId = schoolDoc.id;
        schoolName = schoolDoc.data().schoolName;
        schoolEmail = schoolDoc.data().email;
        break;
      }
    }

    if (!licenseDoc) {
      return res.status(404).send({ message: 'Invalid License!' });
    }

    const licenseData = licenseDoc.data();

    // Check the current device name and update if it's "None" or "N/A"
    if (deviceName) {
      if (licenseData.deviceName === "None" || licenseData.deviceName === "N/A") {
        await licenseDoc.ref.update({ deviceName });
      } else {
        return res.status(400).send({ message: 'License already in use!' });
      }
    }
    
    return res.status(200).send({
      licenseId: licenseDoc.id,
      schoolId: schoolId,
      schoolName: schoolName,
      schoolEmail: schoolEmail,
      status: licenseData.status,
      issuedDate: licenseData.issuedDate,
      expiryDate: licenseData.expiryDate,
      deviceName: deviceName || licenseData.deviceName
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;