var score = document.getElementById("score");
var userUrl = "";

var apigClient = apigClientFactory.newClient({
    apiKey: 'UimFGu9MmE8f1kXp2RPaESXJMpJLt0XaUD5FDc7g'
});

// Get URL of current tab and execute lambda functions
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    userUrl = tabs[0].url;

    var body = {
        url: userUrl
    };

    var scraped;
    var prediction;

    // Webscrape url and return JSON of scraped data
    apigClient.rootPost({}, body)
    .then(function(result){
        console.log(userUrl + " scraped successfully");
        scraped = result.data;
    }).catch( function(result){
        console.log("Failed to scrape " + userUrl);
    });

    // Pass JSON object to be preprocessed and calculate fake news score prediction
    apigClient.METHODNAME({}, scraped) // Need to fill in method name
    .then(function(result){
        console.log("Fake news score predicted successfully");
        prediction = result.data["prediction"] // Need to access data correctly
    }).catch( function(result){
        console.log("Failed to predict fake news score");
    });

    score.insertAdjacentHTML("beforeend", prediction);

});