var score = document.getElementById("score");
var calculate = document.getElementById("calculate");
var userUrl = "";

var apigClient = apigClientFactory.newClient({
    apiKey: 'UimFGu9MmE8f1kXp2RPaESXJMpJLt0XaUD5FDc7g'
});

// Get URL of current tab and execute lambda functions
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    userUrl = tabs[0].url;

    var body = { url: userUrl };
    var scraped = {"url": "", "title": "", "text": ""};

    // Webscrape url and return JSON of scraped data
    apigClient.webscraperPost({}, body)
    .then(function(result){
        console.log(userUrl + " scraped successfully");
        scraped.title = result.data["title"];
        scraped.text = result.data["text"];

        apigClient.modelPost({}, scraped)
         .then(function(result){
           console.log("Fake news score predicted successfully");
           score.innerHTML = "Score: " + result.data;
           
           // Shows an appropriate picture of Pinocchio depending on prediction article receives
           if(parseFloat(result.data) < 5) {
            score.insertAdjacentHTML("beforebegin", "<img class='pinocchio' src='/images/pinocchio-fake.png'>");
           } else {
            score.insertAdjacentHTML("beforebegin", "<img class='pinocchio' src='/images/pinocchio-real.png'>")
           };
         }).catch( function(result){
           console.log("Failed to predict fake news score");
           console.log(result);
         });
    }).catch( function(result){
        console.log("Failed to scrape " + userUrl);
    });

});
