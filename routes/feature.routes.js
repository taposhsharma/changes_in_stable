const express = require("express");
const router = express.Router();
const featureController = require('../controller/feature.controller')


router.get('/FHIR/R4/patient',featureController.patientRecordByNameController)
router.get('/FHIR/R4/patient/:id',featureController.patientRecordByIdController)

router.get('/FHIR/R4/observation',featureController.patientObservationsController)

module.exports = router