const Nightmare = require('nightmare');
const key = require('ckey');

const options = {
	show: true,
	waitTimeout: 60000,
	typeInterval: 25
};

const klipfolioInstance = Nightmare(options);
const JSONDataSourceIds = require('./klip_data/datasource_ids.json');

function klipfolioLogin (callback) {
	klipfolioInstance.goto('https://app.klipfolio.com/')
		.viewport(1024, 700)
		.wait('#f-username')
		.type('#f-username', key.KLIPFOLIO_USERNAME)
		.type('#f-password', key.KLIPFOLIO_PASSWORD)
		.click('#login')
		.wait('#tb-tab-add_klip')
		.then(() => {
			callback();
		})
		.catch(err => console.log(err))
}

klipfolioLogin(brandsForExtraction);

function brandsForExtraction () {
	const klipfolioBrandList = JSONDataSourceIds.klipfolioBrandList;
	brandLooper(klipfolioBrandList, 0);
}

function brandLooper (klipfolioBrandList, index) {
	let currentBrand = klipfolioBrandList[index];

	if (index < klipfolioBrandList.length) {
		brandSearch(currentBrand, () => {
			index++;
			brandLooper(klipfolioBrandList);
		}, index)
	} else console.log(`We are done.`);
}

function brandSearch (currentBrand, callback) {
	let klipfolioIndexPage = JSONDataSourceIds.klipfolioIndexPage;
	let testClass = '#datasources-list';
	console.log(`Processing: ${currentBrand}`);

	klipfolioInstance.goto(klipfolioIndexPage)
		.wait('#library-find')
		.type('#library-find', currentBrand)
		.wait(10000)
		.evaluate(testClass => {
			return document.querySelector(testClass).href;
		}, testClass)
		.then(function (link) {
			console.log(`here first`);
			console.log(link);
			// brandIdsExtractor(callback);
		})
		.catch(err => console.log(err))
}

function brandIdsExtractor (callback) {
	console.log(`'i'm here`);
	klipfolioInstance
		.evaluate(function () {
			return document.querySelector('#datasources-list').href;
		})
		.then(function (link) {
			console.log(link);
			// callback();
		})
		.catch(console.log)
}