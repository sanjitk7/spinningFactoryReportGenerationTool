var express = require('express');
var router = express.Router();

var production_controller = require('../controllers/productionController');

/// Spinning Production Routes ///

//GET production home page
router.get('/', production_controller.index);

// GET request for worker wise production report.
router.get('/reports', production_controller.production_report);

//GET request for idle workers report
router.get('/idleWorkerRep',production_controller.idleWorkerReport);

//GET request for idle workers template
router.get('/idleWorkerTemplate',production_controller.idleWorkerTemplate);

//GET request for machine wise production report
router.get('/machPdnRep',production_controller.machPdnReport);

//GET request for machine wise production template
router.get('/machPdnTemplate',production_controller.machPdnTemplate);

//GET request for building wise production report
router.get('/bdnPdnRep',production_controller.bdnPdnReport);

//GET request for building wise production template
router.get('/bdnPdnTemplate',production_controller.bdnPdnTemplate);

//GET request for  max consumer raw material report
router.get('/rawMatRep',production_controller.rawMatReport);

//GET request fot max raw material template
router.get('/rawMatTemplate',production_controller.rawMatTemplate);

// GET request for last 3 days production
router.get('/reports/last_3_days', production_controller.production_report_last_3_days);

//GET request for yesterdays production
router.get('/reports/yesterday', production_controller.production_report_yesterday);

// GET request for creating a production.
router.get('/create', production_controller.production_create_get);

// POST request for creating Book.
router.post('/create', production_controller.production_create_post);

module.exports = router;
