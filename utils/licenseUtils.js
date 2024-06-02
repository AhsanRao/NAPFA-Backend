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

    // Update the device name if provided
    if (deviceName) {
      await licenseDoc.ref.update({ deviceName });
    }

    const licenseData = licenseDoc.data();
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