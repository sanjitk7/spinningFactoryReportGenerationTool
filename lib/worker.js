var sqlConnection = require('./../app');
console.log(sqlConnection.con);

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
exports.getWorkerPdn = getWorkerPdn;