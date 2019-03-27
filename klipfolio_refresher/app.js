const osmosis = require('osmosis');

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, waitTimeout: 60000 })

const selector = '#refreshStatus';

let dataSourceId = '46a0e6f60b22b48a355779884d1cc080';
let url = 'https://app.klipfolio.com/datasources/view/' + dataSourceId;

nightmare
	.viewport(1024, 700)
	.goto(url)
	.wait('#f-username')
	.type('#f-username', 'jomael@outdoorequipped.com')
	.type('#f-password', ')=L)n60v')
	.click('#login')
	.wait('#refreshLink')
	.click('#refreshLink')
	.wait(5000)
	.evaluate(selector => {
		return document.querySelector(selector).innerText
	}, selector)
	.then(result => {
		console.log(dataSourceId + ": " + result);
	})
