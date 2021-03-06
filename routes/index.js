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
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Welcome to Spinning Mill Production Report' });
// });

// GET home page.
router.get('/', function(req, res) {
	res.redirect('/production_report');
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
				let htmlTableRows = ``;
				htmlTableRows += `<thead style="font-weight: 700;background-color: #dcdcdc;">
                    <tr>
                    <td>WID</td>
                    <td>First Name</td>
                    <td>Last Name</td>
                    <td> Production Qty (Kilos)</td>
                    </tr>
                    </thead>`;
				// Iterate of the rows in the data, use an ES6 "arrow function" to operate on each one
				rows.forEach((row) => {
					// Use ES6 string template to create HTML table rows
					htmlTableRows += `<tr>
                    <td style="border: 1px solid #7DCEA0;">${row.wid}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.fname}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.lname}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.worker_prod}</td>
                </tr>`;
				});

				// HTML for a table
				let htmlTable = `<table style="width:100%; border: 1px solid black;">${htmlTableRows}</table>`;
				res.status(200).send(htmlTable);
			});
		} catch (e) {
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
});

//display workers who are idle in given time frame

router.get('/idleWorker', function(req, res) {
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				"select distinct wid,fname,lname from workers where wid not in (select workers.wid from spinning_prod inner join workers on spinning_prod.wid=workers.wid where m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"'group by wid )";
				db.query(queryString, (err, rows, fields) => {
				let htmlTableRows = ``;
				htmlTableRows += `<thead style="font-weight: 700;background-color: #dcdcdc;">
                    <tr>
                    <td>WID</td>
                    <td>First Name</td>
                    <td>Last Name</td>
                    </tr>
                    </thead>`;
				// Iterate of the rows in the data, use an ES6 "arrow function" to operate on each one
				rows.forEach((row) => {
					// Use ES6 string template to create HTML table rows
					htmlTableRows += `<tr>
                    <td style="border: 1px solid #7DCEA0;">${row.wid}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.fname}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.lname}</td>
                </tr>`;
				});

				// HTML for a table
				let htmlTable = `<table style="width:100%; border: 1px solid black;">${htmlTableRows}</table>`;
				res.status(200).send(htmlTable);
			});
		} catch (e) {
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
});

//#displaying production at induvidial machine level within given time frame

router.get('/machPdn', function(req, res) {
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
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
				let htmlTableRows = ``;
				htmlTableRows += `<thead style="font-weight: 700;background-color: #dcdcdc;">
                    <tr>
                    <td>Machine ID</td>
                    <td>Machine Production</td>
                    <td>Machine Wastage</td>                   
                    </tr>
                    </thead>`;
				// Iterate of the rows in the data, use an ES6 "arrow function" to operate on each one
				rows.forEach((row) => {
					// Use ES6 string template to create HTML table rows
					htmlTableRows += `<tr>
                    <td style="border: 1px solid #7DCEA0;">${row.m_id}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.machine_production}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.machine_waste}</td>
                </tr>`;
				});

				// HTML for a table
				let htmlTable = `<table style="width:100%; border: 1px solid black;">${htmlTableRows}</table>`;
				res.status(200).send(htmlTable);
			});

		} catch (e) {
			log.error(e);
		}


	} else {
		res.sendStatus(400);
		return;
	}
});

//#display buildings and their productivity

router.get('/bdnPdn', function(req, res) {
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
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
				let htmlTableRows = ``;
				htmlTableRows += `<thead style="font-weight: 700;background-color: #dcdcdc;">
                    <tr>
                    <td>Building ID</td>
                    <td>Building Production</td>
                    </tr>
                    </thead>`;
				// Iterate of the rows in the data, use an ES6 "arrow function" to operate on each one
				rows.forEach((row) => {
					// Use ES6 string template to create HTML table rows
					htmlTableRows += `<tr>
                    <td style="border: 1px solid #7DCEA0;">${row.b_id}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.building_prod}</td>
                </tr>`;
				});

				// HTML for a table
				let htmlTable = `<table style="width:100%; border: 1px solid black;">${htmlTableRows}</table>`;
				res.status(200).send(htmlTable);
			});
		} catch (e) {
			log.error(e);
		}
	} else {
		res.sendStatus(400);
		return;
	}
});

//#displaing maximum used type of raw material in time frame

router.get('/rawMat', function(req, res) {
	if (req.query.startDate && req.query.startDate != '' && req.query.endDate && req.query.endDate != '') {
		try {
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const queryString =
				"select item_no,item_name from raw_material_name where raw_material_name.item_no =(select t.item_code as maximum_used_amt from (select spinning_prod.item_no as item_code ,sum(raw_materials.qty) as item_qty_used from spinning_prod inner join raw_materials on spinning_prod.item_no=raw_materials.item_no and spinning_prod.lot_no=raw_materials.lot_no where m_date between '" +
				startDate +
				"' and '" +
				endDate +
				"' group by spinning_prod.item_no order by item_qty_used desc) as t limit 1)";
				db.query(queryString, (err, rows, fields) => {
				let htmlTableRows = ``;
				htmlTableRows += `<thead style="font-weight: 700;background-color: #dcdcdc;">
                    <tr>
                    <td>Item ID</td>
                    <td>Item Name</td>                   
                    </tr>
                    </thead>`;
				// Iterate of the rows in the data, use an ES6 "arrow function" to operate on each one
				rows.forEach((row) => {
					// Use ES6 string template to create HTML table rows
					htmlTableRows += `<tr>
                    <td style="border: 1px solid #7DCEA0;">${row.item_no}</td>
                    <td style="border: 1px solid #7DCEA0;">${row.item_name}</td>
                </tr>`;
				});

				// HTML for a table
				let htmlTable = `<table style="width:100%; border: 1px solid black;">${htmlTableRows}</table>`;
				res.status(200).send(htmlTable);
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
