let worker = require('../lib/worker');

let log4js = require('log4js');
let log = log4js.getLogger('router');

var sqlConnection = require('./../app');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();

function getWorkerPdn(startDate, endDate, cb) {
	console.log("Hits worker");
    let res = {
        status: 0,
        msg: "completed",
        data: []
    };
  sqlConnection.con.query('SELECT * FROM spin.workers', (err,rows) => {
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);

  return rows;
});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

///localhost:3000/workerPdn/?startDate=2019-10-11&endDate=2019-10-14

router.get('/workerPdn', function (req, res) {
    if (req.query.startDate && req.query.startDate != "" && req.query.endDate && req.query.endDate != "" ) {
        console.log("-----------");
        try {
        getWorkerPdn(startDate,endDate, function(err,data){
        res.send(data);
    		});
        } catch (e) {
            log.error(e);
        }

    } else {
        res.send({
            status: 1,
            msg: "no data found",
            components: req.query.show});
    }
});

/*router.get('/workerPdn', function (req, res) {
    if (req.query.page && req.query.page != "" ) {
        try {
            worker.getPageHit('pagestats', req.query.page, function (err, data) {
                res.send(data);
            });
        } catch (e) {
            log.error(e);
        }
    } else {
        res.send({
            status: 1,
            msg: "no data found",
            components: req.query.show});
    }
});
*/
module.exports = router;
