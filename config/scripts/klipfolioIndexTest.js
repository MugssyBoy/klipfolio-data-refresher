const Nightmare = require('nightmare');
const vo = require('vo');

require('dotenv').config();

vo(function*() {
	const nightmare = Nightmare({
		show: true,
		waitTimeout: 60000
	});

	let dataSourceDir = "https://app.klipfolio.com/datasources/view/";
	let myThings = ["Glass", "Mouse", "Phone", "Tissue", "Grips"];
	let dataSourceIds = [
			"46a0e6f60b22b48a355779884d1cc080", "2ada59f88129fa7f25d8894d3264e890",
			"edfb458c83a09d102a556670cf5fe2b3", "e55218bed225c7edee0d8ed5fdb3be63"
		];

	// Sign-in
	yield nightmare.goto("https://app.klipfolio.com/")
		.wait('#f-username')
		.type('#f-username', process.env.KLIPFOLIO_USERNAME)
		.type('#f-password', process.env.KLIPFOLIO_PASSWORD)
		.click('#login')
		.wait('#tb-tab-add_klip')
		.then(function() {
			console.log("Logged In");
		})
		.catch(function(err) {
			console.log(err);
		})

	// Loop each data sources IDs
	for (let i = 0; i < dataSourceIds.length; i++) {
		// Accessing each data sources
		yield nightmare.goto(dataSourceDir + dataSourceIds[i])
			.wait("#refreshLink")
			.then(function() {
				console.log("Done: " + dataSourceIds[i]);
			})
			.catch(function(err) {
				console.log(err);
			})
	}
})();

