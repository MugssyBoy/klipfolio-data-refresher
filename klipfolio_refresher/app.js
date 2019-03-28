const osmosis = require('osmosis');
const Excel = require('exceljs');

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, waitTimeout: 60000 })

const wbDataSourceID = new Excel.Workbook();
const flDataSourceID = './data_sources/dataSourcesID.xlsx';

let klipDetails = require('./klip_data/klip_details.js');

require('dotenv').config();

function crawlKlip(mainUrl, dataSourceId, refSelector) {
	nightmare
		.viewport(1024, 700)
		.goto(mainUrl + dataSourceId)
		.wait('#f-username')
		.type('#f-username', process.env.UN)
		.type('#f-password', process.env.PD)
		.click('#login')
		.wait('#refreshLink')
		.click('#refreshLink')
		.wait(10)
		.evaluate(refSelector => {
			return document.querySelector(refSelector).innerText
		}, refSelector)
		// .end()
		.then(result => {
			console.log(dataSourceId + ": " + result);
		})
		.catch(function(err) {
			console.log("Issue: " + err);
		})
}

function getDataSourceInfo(mainUrl, dataSourceId, refSelector, crawlKlip) {
	crawlKlip(mainUrl, dataSourceId, refSelector);	
}

function dataSourcesIDs() {
	wbDataSourceID.xlsx.readFile(flDataSourceID)
		.then(function() {
			let arrDataSourceIDs = [];
			let shIDs = wbDataSourceID.getWorksheet('IDs');

			shIDs.eachRow({ includeEmpty: false }, function(row, rowNumber) {
				arrDataSourceIDs.push(row.values[1]);
			});
			loopDSIds(arrDataSourceIDs);
		})
		.catch(function(err) {
			console.log("Error: " + err);
		})
};

function loopDSIds(arrDataSourceIDs) {
	// console.log(arrDataSourceIDs);
	for (let i = 0; i < arrDataSourceIDs.length; i++) {
		getDataSourceInfo(
			klipDetails.mainUrl,
			arrDataSourceIDs[i],
			klipDetails.refSelector,
			crawlKlip
		);
		console.log(arrDataSourceIDs[i]);
	}
	// console.log("Data Sources Refreshing: Complete");
}

dataSourcesIDs();