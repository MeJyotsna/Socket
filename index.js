/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require("./site/index.html");
// Apply the styles in style.css to the page.
require("./site/style.css");

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false;

const url = "ws://localhost:8011/stomp";
const client = Stomp.client(url);
client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg);
  }
};
let timer = 0;
setInterval(() => {
  timer++;
}, 1000);
function connectCallback() {
  var onmessage = function (message) {
    parseMessage = JSON.parse(message.body);
    parseMessage.timer = timer;
    refine(parseMessage);
  };
  client.subscribe("/fx/prices", onmessage);
  document.getElementById("stomp-status").innerHTML =
    "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.";
}

client.connect({}, connectCallback, function (error) {
  alert(error.headers.message);
});

const exampleSparkline = document.getElementById("example-sparkline");
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3]);
