const Nightmare = require('nightmare');
const key = require('ckey');
const moment = require('moment');
const momentRange = require('moment-range');
const dateTimeConverter = require('datetime-converter-nodejs');
const os = require('os');
const fs = require('fs');

momentRange.extendMoment(moment);

let options = {
	show: true,
	waitTimeout: 65000, // EES4: 30000
	typeInterval: 25 // EES4: 15
};

const klipfolioInstance = Nightmare(options);
const osHostname = os.hostname().toLowerCase();
const JSONDataSourceIds = require('./klip_data/datasource_ids - test.json');
const JSONDataSourceSelectors = require('./klip_data/datasource_selectors.json');

const historyLogDir = `./logs/`;

let klipfolioExports = module.exports = {};

function loginKlipfolio (callback) {
	console.log(`-------------------------------------------`);
	console.log(`${osHostname}@:~$ logging in klipfolio`);

	klipfolioInstance.goto("https://app.klipfolio.com/")
		.wait('#f-username')
		.type('#f-username', key.KLIPFOLIO_USERNAME)
		.type('#f-password', key.KLIPFOLIO_PASSWORD)
		.click('#login')
		.wait('#tb-tab-add_klip')
		.then(() => {
			console.log(`${osHostname}@:~$ logged in successfully`);
			console.log(`-------------------------------------------`);
			callback();
		})
		.catch(() => console.log(`${osHostname}@:~$ failed to login klipfolio`))
}

function proceedToDataRefresher () {
	const dataSourceIds = JSONDataSourceIds.dataSourceIdList;

	dataSourceLooper(dataSourceIds, 0);
}

function dataSourceLooper (dataSourceIds, index) {
	let currentDataSourceId = dataSourceIds[index];

	if (index < dataSourceIds.length) {
		dataSourceRefresher(currentDataSourceId, () => {
			index++;
			dataSourceLooper(dataSourceIds, index);
		})
	} else {
		console.log(`${osHostname}@:~$ refresh complete`);
		klipfolioInstance.end()
			.then()
	};
}

function dataSourceRefresher (currentDataSourceId, callback) {
	let lastRefreshDate = JSONDataSourceSelectors.lastRefreshDate;
	console.log(`processing: ${currentDataSourceId}`);

	klipfolioInstance.goto(`https://app.klipfolio.com/datasources/view/${currentDataSourceId}`)
	    .wait('#refreshLink')
	    .click('#refreshLink')
	    .wait(50000) // EES4: 15000
	    .evaluate(lastRefreshDate => {
	    	return document.querySelector(lastRefreshDate).innerText;
	    }, lastRefreshDate)
	    .then(resultLastRefreshDate => {
	    	checkLastRefreshDate(currentDataSourceId, resultLastRefreshDate, callback);
	    })
	    .catch((err) => {
	    	console.log(`failed: ${currentDataSourceId}`);
	    	historyLogChecker(currentDataSourceId, 'failed', err, callback);
	    })
}

function checkLastRefreshDate (currentDataSourceId, resultLastRefreshDate, callback) {
	let currentDateTime = dateTimeConverter.isoString(moment().seconds(0).milliseconds(0).format());
	let currentDateTimeRange = moment.range(moment(currentDateTime).add(-2, 'minutes'), currentDateTime, null, []);
	let formattedCurrDateTime = moment(currentDateTime).format('MMM D, YYYY h:mm A');
	let itemDetails;

	if (moment(dateTimeConverter.isoString(resultLastRefreshDate)).within(currentDateTimeRange)) {
		console.log(`success: ${currentDataSourceId}`);

		itemDetails = `date refreshed: [${resultLastRefreshDate}]; date ranged: [${currentDateTimeRange}]`;
		historyLogChecker(currentDataSourceId, 'success', itemDetails, callback)

	} else {
		console.log(`failed: ${currentDataSourceId}`);

		itemDetails = `date processed: [${formattedCurrDateTime}] => last date refreshed: [${resultLastRefreshDate}] date ranged: [${currentDateTimeRange}]`;
		historyLogChecker(currentDataSourceId, 'failed', itemDetails, callback);
	}
}

function historyLogChecker (currentDataSourceId, refreshStatus, itemDetails, callback) {
	let todayDate = moment().format('MMDDYY');
	let historyLogPath = `${historyLogDir}kliplog-${todayDate}.txt`;

	let logCheckingResult = fs.existsSync(historyLogPath) ? true : false;

	historyLogCreator(logCheckingResult, currentDataSourceId, refreshStatus, itemDetails, callback);
}

function historyLogCreator (logCheckingResult, currentDataSourceId, refreshStatus, itemDetails, callback) {
	let todayDate = moment().format('MMDDYY');
	let historyLogPath = `${historyLogDir}kliplog-${todayDate}.txt`;

	let logMainDir = fs.existsSync(historyLogDir) ? true : false;

	if (!logMainDir) {
		fs.mkdirSync(historyLogDir);
	}

	if (logCheckingResult) {
		fs.appendFile(historyLogPath, `${currentDataSourceId}# ${refreshStatus}: ${itemDetails}\n`, err => {
			if (err) throw err;
		});

		callback();

	} else {
		fs.writeFile(historyLogPath, `${currentDataSourceId}# ${refreshStatus}: ${itemDetails}\n`, err => {
			if (err) throw err;
		});

		callback();

	}
}

klipfolioExports.processKlipfolioLogin = function () {
	loginKlipfolio(proceedToDataRefresher);
}