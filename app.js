const osmosis = require('osmosis');
const Excel = require('exceljs');

const Nightmare = require('nightmare');

const nightmare = Nightmare({
	show: true, waitTimeout: 60000
})

const wbDataSourceID = new Excel.Workbook();
const flDataSourceID = './data_sources/dataSourcesID.xlsx';

let klipDetails = require('./klip_data/klip_details.js');

require('dotenv').config();

function crawlKlip(mainUrl, dataSourceId, refSelector) {
	nightmare
		.viewport(1024, 700)
		.goto(klipDetails.dnsKlip)
		.wait('#f-username')
		.type('#f-username', process.env.UN)
		.type('#f-password', process.env.PD)
		.click('#login')
		.wait('#tb-tab-add_klip')
		// .end()
		.then(function() {
			dataSourceId.forEach(function(dsId) {
				nightmare
					.goto(mainUrl + dsId)
					.wait('#refreshLink')
					.click('#refreshLink')
					.wait(50)
					.then(function() {
						console.log(mainUrl + dsId);
					})
					.catch(function(err) {
						console.log("Issue 2: " + err + "-" + dsId);
					})
			})
		})
		.catch(function(err) {
			console.log("Issue 1: " + err);
		})
}

function getDataSourceInfo(mainUrl, dataSourceId, refSelector, callback) {
	callback(mainUrl, dataSourceId, refSelector);
}

function dataSourcesIDs() {
	wbDataSourceID.xlsx.readFile(flDataSourceID)
		.then(function() {
			let arrDataSourceIDs = [];
			let shIDs = wbDataSourceID.getWorksheet('IDs');

			shIDs.eachRow({ includeEmpty: false }, function(row, rowNumber) {
				arrDataSourceIDs.push(row.values[1]);
			});
			getDataSourceInfo(
				klipDetails.mainUrl,
				arrDataSourceIDs,
				klipDetails.refSelector,
				crawlKlip
			);
		})
		.catch(function(err) {
			console.log("Error: " + err);
		})
};

dataSourcesIDs();