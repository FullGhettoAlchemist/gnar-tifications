let request = require("request");
let cheerio = require("cheerio");

module.exports.crawl = function(){
  request({
    uri: "https://www.mtbachelor.com/conditions-report/",
  }, (error, response, body) => {
    let $ = cheerio.load(body);
    let divs = $('.tab1');
    console.log(divs);
  });
}