let request = require("request");
let cheerio = require("cheerio");

export class Crawler {
  constructor(){}

  public crawl(){
    request({
      uri: "https://www.mtbachelor.com/conditions-report/",
    }, (error, response, body) => {
      let $ = cheerio.load(body);
      let divs = $('.tab1');
      console.log(divs);
    });
  }
}
