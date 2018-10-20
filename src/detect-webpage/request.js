var request = require('request');

var pageContent;

request('https://boilerpipe-web.appspot.com/extract?url=https://stackoverflow.com/questions/6756104/get-size-of-json-object&extractor=ArticleExtractor&output=json', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  pageContent = JSON.parse(body)["response"]["content"];
  console.log(pageContent);
});