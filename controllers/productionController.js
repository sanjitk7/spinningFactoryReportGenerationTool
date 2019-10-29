var mysql = require('mysql');
var express = require('express');
var db = require('../db/db');

var async = require('async');

exports.index = function(req, res) {
	async.parallel({}, function(err, results) {
		res.render('index', { title: 'Production Report Home', error: err, data: results });
	});
};

//Display production report
exports.production_report = function(req, res) {
	console.log('inside prod report');
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			console.log('inside prod report');
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				'SELECT workers.wid,workers.fname,workers.lname,SUM(spinning_prod.m_prod) ' +
				'AS worker_prod FROM spinning_prod INNER JOIN workers ON spinning_prod.wid=workers.wid WHERE ' +
				"m_date BETWEEN '" +
				startDate +
				"' AND '" +
				endDate +
				"' GROUP BY wid ORDER BY worker_prod ASC";
			db.query(queryString, (err, rows, fields) => {
				console.log(JSON.stringify(rows));
				res.render('production_report', { title: 'Production Report', productions: rows });
			});
		} catch (e) {
			console.log('in err catch');
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
};

//Display Idle workers
exports.idleWorkerReport = function(req, res) {
	console.log('inside idleWorker report');
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			console.log('inside idleWorker report');
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				"select distinct wid,fname,lname from workers where wid not in (select workers.wid from spinning_prod inner join workers on spinning_prod.wid=workers.wid where m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"'group by wid )";
			db.query(queryString, (err, rows, fields) => {
				console.log(JSON.stringify(rows));
				res.render('idleWorkerReport', { title: 'Idle Workers Report', productions: rows });
			});
		} catch (e) {
			console.log('in err catch');
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
};

//Display Machine Wise Production
exports.machPdnReport = function(req, res) {
	console.log('inside machPdn report');
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			console.log('inside machPdn report');
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				'select m_id,sum(m_prod)' +
				" as machine_production ,round(sum(m_waste),2) as machine_waste from spinning_prod where m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"'group by m_id";
			db.query(queryString, (err, rows, fields) => {
				console.log(JSON.stringify(rows));
				res.render('machPdnReport', { title: 'Machine-wise Production Report', productions: rows });
			});
		} catch (e) {
			console.log('in err catch');
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
};

//Display Building Wise Data
exports.bdnPdnReport = function(req, res) {
	console.log('inside bdnPdn report');
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			console.log('inside bdnPdn report');
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				'select spinning_type.bid,sum(spinning_prod.m_prod) as building_prod from spinning_prod inner join spinning_type on spinning_prod.m_id=spinning_type.m_id where ' +
				"m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"'group by bid";
			db.query(queryString, (err, rows, fields) => {
				console.log(JSON.stringify(rows));
				res.render('bdnPdnReport', { title: 'Building-wise Production Report', productions: rows });
			});
		} catch (e) {
			console.log('in err catch');
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
};

//Display Most used raw material
exports.rawMatReport = function(req, res) {
	console.log('inside rawMat report');
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			console.log('inside rawMat report');
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				"select item_no,item_name from raw_material_name where raw_material_name.item_no =(select t.item_code as maximum_used_amt from (select spinning_prod.item_no as item_code ,sum(raw_materials.qty) as item_qty_used from spinning_prod inner join raw_materials on spinning_prod.item_no=raw_materials.item_no and spinning_prod.lot_no=raw_materials.lot_no where m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"' group by spinning_prod.item_no order by item_qty_used desc) as t limit 1)";
			db.query(queryString, (err, rows, fields) => {
				console.log(JSON.stringify(rows));
				res.render('rawMatReport', { title: 'Maximum used Raw Material', productions: rows });
			});
		} catch (e) {
			console.log('in err catch');
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
};

//Display last 3 days of production report
exports.production_report_last_3_days = function(req, res) {
	try {
		console.log('inside prod report: production_report_last_3_days');
		const startDate = '2019-10-11';
		const endDate = '2019-10-14';
		const queryString =
			'SELECT workers.wid,workers.fname,workers.lname,SUM(spinning_prod.m_prod) ' +
			'AS worker_prod FROM spinning_prod INNER JOIN workers ON spinning_prod.wid=workers.wid WHERE ' +
			"m_date BETWEEN '" +
			startDate +
			"' AND '" +
			endDate +
			"' GROUP BY wid ORDER BY worker_prod ASC";
		db.query(queryString, (err, rows, fields) => {
			console.log(JSON.stringify(rows));
			res.render('production_report', { title: 'Production Report', productions: rows });
		});
	} catch (e) {
		console.log('in err catch');
		log.error(e);
	}
};

//Get prodcution report form
exports.production_create_get = function(req, res) {
	// res.send('NOT IMPLEMNTED: Production create GET');
	res.render('create_production');
};

//Insert production report
exports.production_create_post = function(req, res) {
	res.send('NOT IMPLEMNTED: Production create POST');
};
