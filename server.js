const cheerio = require('cheerio');
const chalk = require('chalk');
const request = require('request-promise');

async function getAnchors(html){

    var $ = cheerio.load(html);

    
}

async function main(url){

    console.log(chalk.green('Loading the main table of content webpage...'));
    request(url)
        .then((body)=>{
            console.log(chalk.green(body));
        })
        .catch((error)=>{
            console.log(chalk.red(error));
        })

}


/**
 * webserial = json file;
 * url = webserial.metadata.ToC.URL;
 * toc = webserial.metadata.ToC.selector;
 * title = webserial.metadata.chapter.title;
 * content = webserial.metadata.chapter.content
 * 
 */
var webserial = require('./webserials/' + 'void-domain.json');
var url = webserial.metadata.ToC.URL;
var toc = webserial.metadata.ToC.selector;
var title = webserial.metadata.chapter.title;
var content = webserial.metadata.chapter.content


main(url);