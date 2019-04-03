const nightmare = require('nightmare');
const options = { show: true,
                  waitTimeout: 60000
                };

const browser = nightmare(options);

const key = require('ckey');

function login (callback) {
  browser
  	.viewport(1024, 700)
  	.goto('https://app.klipfolio.com/')
  	.wait('#f-username')
  	.type('#f-username', key.UN)
  	.type('#f-password', key.PD)
  	.click('#login')
  	.wait('#tb-tab-add_klip')
    .then(callback)
    .catch(() => console.log('Failed to login. Try again'))
};

login(proceedToDataRefresher);

function proceedToDataRefresher () {
  const sourceIdList = require('./config.json').sourceIdList;
  looper(sourceIdList, 0);
};

function looper (sourceIdList, index) {
  let currentKey = sourceIdList[index];

  if(index < sourceIdList.length){
    dataRefresher(currentKey, () => {
      index++;
      looper(sourceIdList, index);
    });
  } else console.log('DONE!');
}

function dataRefresher (currentKey, callback) {
  console.log(`Working on key: ${currentKey}...`);
  browser
    .goto(`https://app.klipfolio.com/datasources/view/${currentKey}`)
    .wait('#refreshLink')
    .click('#refreshLink')
    .wait(50)
    .then(function() {
      callback();
    })
    .catch(function(err) {
      console.log("Issue: " + err + "-" + dsId);
    })

}


// 46a0e6f60b22b48a355779884d1cc080
// 2ada59f88129fa7f25d8894d3264e890
// edfb458c83a09d102a556670cf5fe2b3
// e55218bed225c7edee0d8ed5fdb3be63

// let klipDetails = require('./klip_data/klip_details.js');
//
// require('dotenv').config();
//
// function crawlKlip(mainUrl, dataSourceId, refSelector) {
// 	nightmare
// 		.viewport(1024, 700)
// 		.goto(klipDetails.dnsKlip)
// 		.wait('#f-username')
// 		.type('#f-username', process.env.UN)
// 		.type('#f-password', process.env.PD)
// 		.click('#login')
// 		.wait('#tb-tab-add_klip')
// 		// .end()
// 		.then(function() {
// 			dataSourceId.forEach(function(dsId) {
// 				nightmare
// 					.goto(mainUrl + dsId)
// 					.wait('#refreshLink')
// 					.click('#refreshLink')
// 					.wait(50)
// 					.then(function() {
// 						console.log(mainUrl + dsId);
// 					})
// 					.catch(function(err) {
// 						console.log("Issue 2: " + err + "-" + dsId);
// 					})
// 			})
// 		})
// 		.catch(function(err) {
// 			console.log("Issue 1: " + err);
// 		})
// }
//
// function getDataSourceInfo(mainUrl, dataSourceId, refSelector, callback) {
// 	callback(mainUrl, dataSourceId, refSelector);
// }
//
// function dataSourcesIDs() {
// 	wbDataSourceID.xlsx.readFile(flDataSourceID)
// 		.then(function() {
// 			let arrDataSourceIDs = [];
// 			let shIDs = wbDataSourceID.getWorksheet('IDs');
//
// 			shIDs.eachRow({ includeEmpty: false }, function(row, rowNumber) {
// 				arrDataSourceIDs.push(row.values[1]);
// 			});
// 			getDataSourceInfo(
// 				klipDetails.mainUrl,
// 				arrDataSourceIDs,
// 				klipDetails.refSelector,
// 				crawlKlip
// 			);
// 		})
// 		.catch(function(err) {
// 			console.log("Error: " + err);
// 		})
// };
//
// dataSourcesIDs();
