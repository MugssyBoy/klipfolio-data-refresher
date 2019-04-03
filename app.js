const Nightmare = require('nightmare');
const key = require('ckey');
const moment = require('moment');
const momentRange = require('moment-range');
const dateTimeConverter = require('datetime-converter-nodejs');
const os = require('os');

momentRange.extendMoment(moment);

const options = { show: true, waitTimeout: 120000, typeInterval: 25 };
const klipfolio = Nightmare(options);
const osHostname = os.hostname();

function loginKlipfolio (callback) {
	console.log(`${osHostname}: Logging in Klipfolio...`);
	klipfolio.goto("https://app.klipfolio.com/")
		.viewport(1024, 700)
		.wait('#f-username')
		.type('#f-username', key.KLIPFOLIO_USERNAME)
		.type('#f-password', key.KLIPFOLIO_PASSWORD)
		.click('#login')
		.wait('#tb-tab-add_klip')
		.then(() => {
			console.log(`${osHostname}: Logged In Successfully!`);
			callback();
		})
		.catch(() => console.log(`${osHostname}: Failed to Login Klipfolio`))
}

function proceedToDataRefresher () {
	const dataSourceIds = require('./klip_data/datasource_ids.json').dataSourceIdList;
	dataSourceLooper(dataSourceIds, 0);
}

function dataSourceLooper (dataSourceIds, index) {
	let currentDataSourceId = dataSourceIds[index];

	if (index < dataSourceIds.length) {
		dataSourceRefresher(currentDataSourceId, () => {
			index++;
			dataSourceLooper(dataSourceIds, index);
		}, index)
	} else console.log(`${osHostname}: Data Sources Refresh Completed!`);
}

function dataSourceRefresher (currentDataSourceId, callback, index) {
	const lastRefreshDate = require('./klip_data/datasource_ids.json').lastRefreshDate;
	console.log(`Processing: [${index + 1}] ${currentDataSourceId}`);

	klipfolio.goto(`https://app.klipfolio.com/datasources/view/${currentDataSourceId}`)
	    .wait('#refreshLink')
	    .click('#refreshLink')
	    .wait(50000)
	    .evaluate(lastRefreshDate => {
	    	return document.querySelector(lastRefreshDate).innerText;
	    }, lastRefreshDate)
	    .then(resultLastRefreshDate => {
	    	checkLastRefreshDate(resultLastRefreshDate, index, callback);
	    })
	    .catch((err) => console.log(`Failed to Refresh: ${currentDataSourceId} ${err}`))
}

function checkLastRefreshDate (resultLastRefreshDate, index, callback) {
	let currentDateTime = dateTimeConverter.isoString(moment().seconds(0).milliseconds(0).format());
	let currentDateTimeRange = moment.range(moment(currentDateTime).add(-2, 'minutes'), currentDateTime, null, []);

	let formattedCurrDateTime = moment(currentDateTime).format('MMM D, YYYY h:mm A');

	if (moment(dateTimeConverter.isoString(resultLastRefreshDate)).within(currentDateTimeRange)) {
		console.log(
			`Success: [${index + 1}]; Date Refreshed: [${resultLastRefreshDate}]; Date Ranged: [${currentDateTimeRange}]`
		);
		callback();
	} else {
		console.log(
			`Failed: [${index + 1}] Date Processed: [${formattedCurrDateTime}] => Last Date Refreshed: [${resultLastRefreshDate}] Date Ranged: [${currentDateTimeRange}]`
		);
		callback();
	}
}


loginKlipfolio(proceedToDataRefresher);
