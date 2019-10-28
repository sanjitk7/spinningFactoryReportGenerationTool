let log4js = require('log4js');
let log = log4js.getLogger('router');

var mysql = require('mysql');
var express = require('express');
var db = require('../db/db');

var router = express.Router();

router.get('/worker/:id', (req, res) => {
	const queryString = 'SELECT * from workers where wid = ?';
	const workerId = req.params.id;
	db.query(queryString, [ workerId ], (err, rows, fields) => {
		res.json(rows);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Welcome to Spinning Mill Production Report' });
});

// http://localhost:3000/workerPdn/?startDate=2019-10-11&endDate=2019-10-14
// select workers.wid,workers.fname,workers.lname,sum(spinning_prod.m_prod) as worker_prod
// from spinning_prod inner join workers on spinning_prod.wid=workers.wid where m_date
// between '2019-10-11' and '2019-10-14' group by wid order by worker_prod asc;
router.get('/workerPdn', function(req, res) {
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
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
				res.json(rows);
			});
		} catch (e) {
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
});
module.exports = router;
