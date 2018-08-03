const cheerio = require('cheerio');
const chalk = require('chalk'); //For creativity! Green is not a creative color...
const request = require('request-promise');
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * This creates the PDF document
 * 
 * @param {Array} anchors The array of anchors to be extracted
 */
async function createPDF(anchors){

    var chapter = [];
    var chaptertitles = [];
    var errors = [];

    // Whole Chapter
    
    for(var i=0; i<anchors.length;i++){
        var isPromiseRejected = false;

        var body = await getChapterHTML(anchors[i],3).catch(function errorHandler(error){
            chapter[i] = ["An error occured during the retrieval of this chapter, please view it online..."];
            chaptertitles[i] = 'Chapter ' + (i+1) ;
            errors.push(chaptertitles[i]);

            console.log(chalk.red('ERROR:'),error);
            isPromiseRejected = true;
        });
        if(isPromiseRejected==true){
            continue;
        }

        if(title!=null || title!=""){
            chaptertitles[i] = getChapterTitle(body);
        }

        chapter[i] = await getChapter(body).then((paragraphs)=>{
            console.log(chalk.green('>>'),'Finished loading chapter content!\n');
            console.log(chalk.green('>>'), chalk.blue('Chapter ' + (i+1) + '; '), 'number of paragraphs: ', chalk.yellow(paragraphs.length));
            return paragraphs;
        }).catch((error)=>{
            console.log(chalk.red('ERROR:'),error);
        });
    }

    //For debugging purposes Lel only 1 chapter
    /*
    var body = await getChapterHTML(anchors[132],3).catch((error)=>{
        console.log(chalk.red('ERROR:'),error);
        return getChapterHTML(anchors[133],3);
    });

     if(title!=null || title!=""){
            chaptertitles[0] = getChapterTitle(body);
    }
    
    chapter[0] = await getChapter(body).then((paragraphs)=>{
        console.log(chalk.green('>>'),'Finished loading chapter content!\n');
        console.log(chalk.green('>>'), chalk.blue('Chapter ' + (0) + '; '), 'number of paragraphs: ', chalk.yellow(paragraphs.length));
        return paragraphs;
    }).catch((error)=>{
        console.log(chalk.red('ERROR:'),error);
    });*/

    //console.log(chapter[0].length);

    console.log(chalk.green('>>'),'Processing PDF, please wait...');
    var doc = new PDFDocument;

    doc.pipe(fs.createWriteStream(webserial.name + ".pdf"));

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

        var chaptertitle = (title != null || title !="") ? chaptertitles[i] : ("Chapter " + (i+1));
        //Chapter Header

        doc.addPage()
            .fontSize(25)
            .text(chaptertitle, 100, 100)
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
    if(errors.length>0){
        console.log(chalk.green('>>'),'Program executed with ', chalk.red(errors.length), ' errors. They are the following chapters:\n');
        for(var i = 0; i<errors.length;i++){
            console.log(chalk.red('#'),errors[i]);
        }
    }
    else{
        console.log(chalk.green('>>'),'Program executed without any issues, enjoy the read! :)');
    }
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
 * Gets the title of the chapter if title is not blank in JSON
 * 
 * @param {String} html This refers to the whole HTML document of the chapter. 
 */
function getChapterTitle(html){

    var $ = cheerio.load(html);
    var chaptertitle = $(title).text();

    return chaptertitle;
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
 * @param {Number} retries This refers to the number of retries left before the application exits upon error
 */
function getChapterHTML(url, retries){

    console.log(chalk.green('\n\n>>'),'Loading the html body of ', chalk.blue(url));

    return request(url).catch((error)=>{
        if(retries>0){
            console.log(chalk.red('ERROR:'),'An error occured, retrying...');
            return getChapterHTML(url, retries -1);
        }
        else{
            throw 'Maximum retries has been used, connectivity issues or encoding errors are at play. Skipping the chapter';
        }
    });
}

/**
 * This will serve as the main function for the webcrawler.
 * It first loads the url to be the root html for Cheer.io to
 * traverse upon.
 * 
 */
function main(){

    //Checks if the command is valid or not, else exits
    if(processCLIInput()){

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

}

/**
 * Processing of commands from the CLI
 */
function processCLIInput(){

    function displayHelp(){
        console.log(chalk.green('>>'),`
            Please check the following commands:
                -help                   :   Displays the commands and help window
                -load <filename>.json   :   Loads the file to be processed
        `);
    }

    if(process.argv[2]){
        let command = process.argv[2];

        if(command.indexOf('-')===0){

            command = command.substring(1);

            if(command == 'help'){
                displayHelp();
                return false();
            }
            else if(command == 'load'){
                if(process.argv[3]){
                    var filename = process.argv[3];

                    if(filename.indexOf(('.json').toLowerCase())!=-1){
                        webserial = require('./webserials/' + filename);
                        url = webserial.metadata.ToC.url;
                        toc = webserial.metadata.ToC.selector;
                        title = webserial.metadata.chapter.title;
                        content = webserial.metadata.chapter.content
                        return true;
                    }
                    else{
                        console.log(chalk.red('ERROR:'), 'Invalid filetype, check your arguments and if it is in JSON format.');
                        return false;
                    }
                }
                else{
                    return false;
                }
            }

        }
        else{
            console.log(chalk.red('ERROR:'), 'That seems to be an invalid command.');
            displayHelp();

            return false;
        }
    }

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
var webserial, url, toc, title, content;

//Main
main();