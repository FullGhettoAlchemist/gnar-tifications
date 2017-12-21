let request = require("request");
let cheerio = require("cheerio");

module.exports.crawl = function(){
  request({
    uri: "https://www.mtbachelor.com/conditions-report/",
  }, (error, response, body) => {
    let $ = cheerio.load(body);
    let divs = $('.tab1').find('.list-lifts').children().eq(7).find('.statuses').eq(0).find('.status').eq(0).find('i').attr('class');
    // let divs = $('.tab1').find('.list-lifts');
    // for(let thing in divs){
    //   console.log(thing);
    // }
    console.log(divs);
  });
}