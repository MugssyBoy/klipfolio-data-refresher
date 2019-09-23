const schedule = require('node-schedule');
const klipfolioDataRefresher = require('./klipfolioDataRefresher.js');

const klipfolioRefreshSchedule = schedule.scheduleJob('0 13 * * 0-6', function() {
	klipfolioDataRefresher.processKlipfolioLogin();
});
