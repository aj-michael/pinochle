var express = require('express');
var nodemailer = require('nodemailer');
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
}

/* A deck of proper size in order. */
function deck(deckSize) {
  return Array.apply(null, {length: deckSize}).map(Number.call, Number);
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
  var valueValue = '0';
  switch (valueNumber) {
    case 0:
      valueValue = '9';
      break;
    case 1:
      valueValue = '9';
      break;
    case 2:
      valueValue = '10';
      break;
    case 3:
      valueValue = '10';
      break;
    case 4:
      valueValue = 'J';
      break;
    case 5:
      valueValue = 'J';
      break;
    case 6:
      valueValue = 'Q';
      break;
    case 7:
      valueValue = 'Q';
      break;
    case 8:
      valueValue = 'K';
      break;
    case 9:
      valueValue = 'K';
      break;
    case 10:
      valueValue = 'A';
      break;
    case 11:
      valueValue = 'A';
      break;
  }
  return valueValue;
}

function printableSuit(suitNumber) {
  var suitValue = 'Z';
  switch(suitNumber) {
    case 0:
      suitValue = '\u2663'
      break;
    case 1:
      suitValue = '\u2666'
      break;
    case 2:
      suitValue = '\u2660'
      break;
    case 3:
      suitValue = '\u2661'
      break;
  }
  return suitValue;
}

function sendHand(players, number, hand) {
  client.sms.messages.create({
    to: '+1' + number,
    from: '+13343943618',
    body: 'Game ' + gameNumber + '\n Your hand: ' + hand
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinochle Shuffler' });
});

/* POST shuffle request. */
router.post('/', function(req, res) {
  console.log('Received shuffle request: ' + JSON.stringify(req.body));
  var pinochleDeck = deck(48);
  shuffle(pinochleDeck);
  console.log('Shuffled deck is ' + pinochleDeck);

  var email1 = req.body.email1;
  console.log(email1);

  var numericalComparator = function(a, b) { return a - b; };
  var hand1 = printableHand(pinochleDeck.slice(0,12).sort(numericalComparator));
  var hand2 = printableHand(pinochleDeck.slice(12,24).sort(numericalComparator));
  var hand3 = printableHand(pinochleDeck.slice(24,36).sort(numericalComparator));
  var hand4 = printableHand(pinochleDeck.slice(36,48).sort(numericalComparator));
  console.log(hand1);

  var email1 = req.body.email1;
  var email2 = req.body.email2;
  var email3 = req.body.email3;
  var email4 = req.body.email4;

  sendHand([email1, email2, email3, email4], email1, hand1);
  sendHand([email1, email2, email3, email4], email2, hand2);
  sendHand([email1, email2, email3, email4], email3, hand3);
  sendHand([email1, email2, email3, email4], email4, hand4);

  gameNumber += 1;

  res.render('index', { title: 'Pinochle Shuffler' });
});



module.exports = router;
