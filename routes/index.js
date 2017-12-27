var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient('ACc0a8ab7d1a3137833e93cff17deffd4b', '73ecf9fe245ea13f84a85712ec7deedc');

var gameNumber = 1;

/* Shuffles an array in place using Fisher-Yates. */
function shuffle(arr) {
  var i = 0;
  var j = 0;
  var temp = null;

  for (i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

/* An array containing [0, 1, ..., size - 1]. */
function makeDeck(size) {
  return Array.apply(null, {length: size}).map(Number.call, Number);
}

function printableHand(handArr) {
  return handArr.map(printableCard).join(", ");
}

function printableCard(cardNumber) {
  var suitNumber = Math.floor(cardNumber / 12);
  var valueNumber = cardNumber % 12;
  return printableValue(valueNumber) + printableSuit(suitNumber);
}

function printableValue(valueNumber) {
  var values = ['9', 'J', 'Q', 'K', '10', 'A'];
  return values[Math.floor(valueNumber / 2)];
}

function printableSuit(suitNumber) {
  var values = ['\u2663', '\u2666', '\u2660', '\u2661'];
  return values[suitNumber % 4];
}

function sendMessages(numbers, messages) {
  for (var i = 0; i < numbers.length; i++) {
    var number = numbers[i];
    var message = messages[i];
    client.sms.messages.create({
      to: '+1' + number,
      from: '+13343943618',
      body: message
    }, function(error, message) {
      if (!error) {
        console.log("Twilio succeeded!");
        console.log(message);
      } else {
        console.log("Oops, Twilio had an error.");
        console.log(error);
      }
    });
  }
}

/**
 * Given a deck represented as a list of numbers corresponding to a sorted
 * pinochle deck, returns an array of formatted card strings divided arbitrarily
 * between a number of players.
 */
function dealPrintableHands(deck, players, cardsPerPlayer) {
  var numericalComparator = function(a, b) { return a - b; };
  return makeDeck(players)
      .map(_ => deck.splice(0, cardsPerPlayer))
      .map(hand => hand.sort(numericalComparator))
      .map(printableHand);
}

function pinochleMessage(hand) {
  return 'Game ' + gameNumber + '\n Your hand: ' + hand;
}

function messagesForPinochle() {
  return dealPrintableHands(shuffle(makeDeck(48)), 4, 12).map(pinochleMessage);
}

function euchreMessage(hand, upcard) {
  return 'Game ' + gameNumber + '\n Your hand: ' + hand + '\n Upcard: ' + upcard
}

function messagesForEuchre(req, res) {
  // Multiply by 2 so that only one of each card is used.
  var deck = shuffle(makeDeck(24)).map(x => x*2);
  var upcard = printableCard(deck.pop());
  return dealPrintableHands(deck, 4, 5).map(hand => euchreMessage(hand, upcard));
}

function renderMainPage(req, res) {
  res.render('index', { title: 'Pinochle/Euchre Shuffler' });
}

router.get('/', renderMainPage);

router.post('/', function(req, res) {
  console.log("Received request: " + JSON.stringify(req.body));
  var messages = (req.body.euchre == "on")
      ? messagesForEuchre()
      : messagesForPinochle();
  sendMessages(req.body.phone, messages);
  gameNumber += 1;
  renderMainPage(req, res);
});

module.exports = router;
