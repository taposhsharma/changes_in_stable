const express = require("express");
const router = express.Router();
const auth = require('../middleware/frontendAuth')

// this is file to check that clientId is valid or not 
// const auth = require("../middleware/client.auth");
// const attemptLimit = require('../middleware/attemptLimit')

// const healthchartController = require("../controller/healthchart.controller");
// const clientController = require('../controller/client.controller')


const frontendController = require('../controller/frontend.controller')


// router.use(auth)
// router.use(attemptLimit)
// router.get('/gethealthchartData',  healthchartController.gethealthchartDataController);
// router.get('/getcounts', clientController.countTableController)

router.get('/getHospitalData',frontendController.getHospitalDataController)
router.post('/addHospital',frontendController.addHospitalController)

router.post('/getStats',frontendController.getStatsController)
router.post('/addLisence',frontendController.addLisenceController)

router.post('/signup',frontendController.signupController);
router.post('/login',frontendController.loginController);

router.post('/addConfig',frontendController.addConfigController);

router.get('/totalHitsPerDay', frontendController.totalHitsPerDayController);
router.get('/hospitalRegPerDay', frontendController.hospitalRegPerDayController);
router.get('/numHospitalReg', frontendController.numHospitalRegController)
router.post('/addGrouper', frontendController.addGrouperController)
router.post('/addIcuList', frontendController.addIcuListController)
router.post('/addorgDeptMap', frontendController.addorgDeptMapController)
router.post('/addignoredDepts', frontendController.addignoredDeptsController)
router.post('/addresources', frontendController.addresourcesController)
router.get('/getconfig/:id', frontendController.getConfigController)
router.get('/getgrouper/:id',frontendController.getGrouperController)
router.put('/updateconfig',frontendController.updateConfigController)
router.put('/updateGrouper',frontendController.updateGrouperController)
router.delete('/deleteGrouper', frontendController.deleteGrouperController)
router.get('/getIcuList/:id',frontendController.getIcuListController)
router.put('/updateIcuList',frontendController.updateIcuListController)
router.delete('/deleteIcuList', frontendController.deleteIcuListController)
router.get('/getOrgDeptMap/:id',frontendController.getOrgDeptMapController)
router.put('/updateOrgDeptMap',frontendController.updateOrgDeptMapController)
router.delete('/deleteOrgDeptMap', frontendController.deleteOrgDeptMapController)
router.get('/getignoreddepts/:id',frontendController.getignoreddeptsController)
router.put('/updateignoreddepts',frontendController.updateignoreddeptsController)
router.delete('/deleteignoreddepts', frontendController.deleteignoreddeptsController)
router.get('/getResources/:id',frontendController.getResourcesController)
router.put('/updateresources',frontendController.updateresourcesController)
router.delete('/deleteresources', frontendController.deleteresourcesController)



module.exports = router;
