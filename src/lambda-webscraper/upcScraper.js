const scraper = require('./hackUPCindex.js')


const argv = require('yargs')
  .usage('Usage: $0 --url <url> ')
  .option('run', {
    alias: 'r',
    describe: 'Run your program',
    demandOption: false
  })
  .option('url', {
    alias: 'u',
    describe: 'Url to get the text from',
    // demandOption: true
  })
  .option('h1', {
    describe: 'Selector furl = event.url;or title',
    default: 'h1'
  })
  .option('text', {
    alias: 't',
    describe: 'Selector for text',
    default: 'p'
  })
  .option('output', {
    alias: 'o',
    describe: 'Output file path'
  })
  .argv;

exports.handler = (event, context, callback) => {
    var json = {"url" : "", "title" : "", "text" : ""}
    
    url = event.url;
    json.url = url;
    argv.url = url;
    
    scraper.getHtml(url, (err, html) => {
      if (err) {
        callback(console.log('ERROR performing the request: ' + err.message, err));
      }
      
      var text = scraper.processHtml(html, argv, true);
      
      json.title = text.title;
      json.text = text.body;
      callback(null, json);
    });
}
