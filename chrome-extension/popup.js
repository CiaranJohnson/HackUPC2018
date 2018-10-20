var score = document.getElementById("score");
var userUrl = "";
var prediction;

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

    // Webscrape url and return JSON of scraped data
    apigClient.webscraperPost({}, body)
    .then(function(result){
        console.log(userUrl + " scraped successfully");
        console.log(result.data["title"]);
        console.log(result.data["text"]);
        scraped = result.data;
    }).catch( function(result){
        console.log("Failed to scrape " + userUrl);
    });

    // Pass JSON object to be preprocessed and calculate fake news score prediction
    apigClient.modelPost({}, scraped)
    .then(function(result){
        console.log("Fake news score predicted successfully");
        prediction = result.data["prediction"] // Need to access data correctly
    }).catch( function(result){
        console.log("Failed to predict fake news score");
    });

    core.insertAdjacentHTML("beforeend", prediction);

});

// Shows an appropriate picture of Pinocchio depending on prediction article receives
if(prediction == 1) {
    score.insertAdjacentHTML("beforebegin", "<img class='pinocchio' src='/images/pinocchio-fake.png'>");
} else {
    score.insertAdjacentHTML("beforebegin", "<img class='pinocchio' src='/images/pinocchio-real.png'>")
};