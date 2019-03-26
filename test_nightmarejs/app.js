const vo = require('vo');
const Nightmare = require('nightmare');

vo(function* () {
  let nightmare = Nightmare({
    show: true,
    typeInterval: 10,
    waitTimeout: 60000
  });

  let hrefs = [];

  let test = yield nightmare
  .viewport(1024, 750)
  .goto('https://app.klipfolio.com/datasources/index')
  .type('#f-username', 'jomael@outdoorequipped.com')
  .type('#f-password', ')=L)n60v')
  .click('#login')
  .wait('#library-find')
  .type('#library-find', 'adidas')
  .wait('#datasources-list')
  // .evaluate(
  //   function ()
  //   {
  //     $('.auto-datasources_index-datasourceslist-datasource').find('a').each(
  //       function()
  //       {
  //         hrefs.push($(this).attr('href'));
  //         return hrefs;
  //       });
  //       // console.log(hrefs);
  //   })
  // .run(
  //   function (err, hrefs)
  //   {
  //     if (err) return console.log(err);
  //     console.log(hrefs);
  //     console.log('Done!');
  //   }
  // )
  .then(function () {
    let myText = "";
    $('.auto-datasources_index-datasourceslist-datasource a').each(
      function() {
        myText += $(this).attr("href");
        // hrefs.push($(this).attr('href'));
        return myText;
      });
    console.log(myText);
  })
  // .end(() => 'Done!')
  // .then(console.log(test))
  // console.log(test);
  // yield nightmare.end()
  // .catch(error => {
  //   console.error('Search failed:', error)
  // })
})(function (err, res) {
  if (err) return console.log(err);
});
