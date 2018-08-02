const cheerio = require('cheerio');
const chalk = require('chalk'); //For creativity! Green is not a creative color...
const request = require('request-promise');
const PDFDocument = require('pdfkit');
const fs = require('fs');

async function createPDF(anchors){

    var chapter = [];

    // Whole Chapter
    for(var i=0; i<anchors.length;i++){
        var body = await getChapterHTML(anchors[i]);

        chapter[i] = await getChapter(body).then((paragraphs)=>{
            console.log(chalk.green("Finished loading chapter content!\n"))
            console.log(chalk.blue("Chapter " + (i+1) +"; "), chalk.green("number of paragraphs:"), paragraphs.length);
            return paragraphs;
        })
    }

    /*//For debugging purposes Lel only 1 chapter
    var body = await getChapterHTML(anchors[0]);

    chapter[0] = await getChapter(body).then((paragraphs)=>{
        console.log(chalk.green('>>'),'Finished loading chapter content!\n');
        console.log(chalk.green('>>'), chalk.blue('Chapter ' + 1 + '; '), 'number of paragraphs: ', chalk.yellow(paragraphs.length));
        return paragraphs;
    })*/

    //console.log(chapter[0].length);

    console.log(chalk.green('>>'),'Processing PDF, please wait...');
    var doc = new PDFDocument;

    doc.pipe(fs.createWriteStream('output.pdf'));

    //METADATA of the webserial
    doc.fontSize(36)
        .text(webserial.name, {align:'center'})
        .moveDown()
        .fontSize(16)
        .text('By: '+ webserial.author, {align:'center'})
        .moveDown();

    doc.fontSize(8)
        .text('Created using ', {align:'center'})
        .fillColor('blue')
        .text('node-webserial-crawler ', {link:'https://github.com/OxygenJam/node-webserial-crawler', underline:true, align: 'center'})
        .fillColor('black')
        .text('and ', {align:'center'})
        .fillColor('blue')
        .text('PDFkit', {link:'http://pdfkit.org', align:'center', underline: true})
        .fillColor('black');

    for(var i = 0; i<chapter.length; i++){

        //Chapter Header
        doc.addPage()
            .fontSize(25)
            .text('Chapter '+ (i+1), 100, 100)
            .moveDown();

        //Paragraph
        for(var j = 0; j<chapter[i].length; j++){


            doc.fontSize(12)
                .text(chapter[i][j])
                .moveDown();
        }

    }

    doc.end();

    console.log(chalk.green('>>'),'PDF finished, saved as output.pdf');
}

/**
 * This function retrieves all the anchors or chapters in the root HTML document.
 * Here will be stored are the chapters and their respective url for their own
 * HTML document.
 * 
 * @param {String} html This refers to the whole HTML document that was streamed by Request. 
 */
async function getAnchors(html){

    var $ = cheerio.load(html);
    var anchors = [];

    
    console.log(chalk.green('>>'),'Indexing chapters...');
    $(toc).each((i, elem)=>{
        anchors[i] = $(elem).attr('href');
        console.log(chalk.green(">>"),anchors[i]);
    });

    console.log(chalk.green('>>'), 'Total number of chapters: ', chalk.yellow(anchors.length));
    

    createPDF(anchors);
}

/**
 * This will retrieve all the paragraphs(content) inside the the
 * HTML document in preparation for export as a tangible file
 * 
 * @param {String} html This refers to the whole HTML document of the chapter. 
 */
async function getChapter(html){

    var $ = cheerio.load(html);
    var paragraphs = [];
    console.log(chalk.green('>>'),'Retrieving chapter content...');

    $(content).each((i,elem)=>{
        paragraphs[i] = $(elem).text();
    })

    return paragraphs;
}


/**
 * This retrieves the HTML document for the getChapter function to use.
 * 
 * @param {String} url This refers to the url string of the chapter to be extracted from
 */
function getChapterHTML(url){
    console.log(chalk.green('\n\n>>'),'Loading the html body of ', chalk.blue(url));
    return request(url);
}

/**
 * This will serve as the main function for the webcrawler.
 * It first loads the url to be the root html for Cheer.io to
 * traverse upon.
 * 
 * @param {String} url This refers to the url string of the ToC where the chapters are seen.
 */
function main(url){

    console.log(chalk.green('>>'),'Loading the main table of content webpage...');
    request(url)
        .then((body)=>{
            console.log(chalk.green(body));
            
            getAnchors(body);
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
 * This are the JSON data that will be passed as arguments
 * for the webcrawling functions in this application.
 * 
 */
var webserial = require('./webserials/' + 'void-domain.json');
var url = webserial.metadata.ToC.URL;
var toc = webserial.metadata.ToC.selector;
var title = webserial.metadata.chapter.title;
var content = webserial.metadata.chapter.content

//Main
main(url);