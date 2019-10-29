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

//Get prodcution report form
exports.production_create_get = function(req, res) {
	res.send('NOT IMPLEMNTED: Production create GET');
};

//Insert production report
exports.production_create_post = function(req, res) {
	res.send('NOT IMPLEMNTED: Production create POST');
};
