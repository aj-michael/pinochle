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
      valueValue = 'J';
      break;
    case 3:
      valueValue = 'J';
      break;
    case 4:
      valueValue = 'Q';
      break;
    case 5:
      valueValue = 'Q';
      break;
    case 6:
      valueValue = 'K';
      break;
    case 7:
      valueValue = 'K';
      break;
    case 8:
      valueValue = '10';
      break;
    case 9:
      valueValue = '10';
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

function sendHand(players, number, hand, upcard) {
  if (upcard == null) {
    message = 'Game ' + gameNumber + '\n Your hand: ' + hand
  } else {
    message = 'Game ' + gameNumber + '\n Your hand: ' + hand + '\n Upcard: ' + upcard
  }
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinochle Shuffler' });
});

router.post('/euchre', function(req, res) {
  console.log('Received shuffle request: ' + JSON.stringify(req.body));
  var deck = deck(24);
  shuffle(deck);
  console.log('Shuffled deck is ' + deck);
  var phone1 = req.body.phone1;
  var phone2 = req.body.phone2;
  var phone3 = req.body.phone3;
  var phone4 = req.body.phone4;
  var numericalComparator = function(a, b) { return a - b; };
  var hand1 = printableHand(pinochleDeck.slice(0,5).sort(numericalComparator));
  var hand2 = printableHand(pinochleDeck.slice(5,10).sort(numericalComparator));
  var hand3 = printableHand(pinochleDeck.slice(10,15).sort(numericalComparator));
  var hand4 = printableHand(pinochleDeck.slice(15,20).sort(numericalComparator));
  var upcard = printableHand(pinochleDeck.slice(20,21));
  sendHand([phone1, phone2, phone3, phone4], phone1, hand1, upcard);
  sendHand([phone1, phone2, phone3, phone4], phone2, hand2, upcard);
  sendHand([phone1, phone2, phone3, phone4], phone3, hand3, upcard);
  sendHand([phone1, phone2, phone3, phone4], phone4, hand4, upcard);

  gameNumber += 1;

  res.render('index', { title: 'Pinochle Shuffler' });
}

/* POST shuffle request. */
router.post('/', function(req, res) {
  console.log('Received shuffle request: ' + JSON.stringify(req.body));
  var pinochleDeck = deck(48);
  shuffle(pinochleDeck);
  console.log('Shuffled deck is ' + pinochleDeck);

  var numericalComparator = function(a, b) { return a - b; };
  var hand1 = printableHand(pinochleDeck.slice(0,12).sort(numericalComparator));
  var hand2 = printableHand(pinochleDeck.slice(12,24).sort(numericalComparator));
  var hand3 = printableHand(pinochleDeck.slice(24,36).sort(numericalComparator));
  var hand4 = printableHand(pinochleDeck.slice(36,48).sort(numericalComparator));
  console.log(hand1);

  var phone1 = req.body.phone1;
  var phone2 = req.body.phone2;
  var phone3 = req.body.phone3;
  var phone4 = req.body.phone4;

  sendHand([phone1, phone2, phone3, phone4], phone1, hand1);
  sendHand([phone1, phone2, phone3, phone4], phone2, hand2);
  sendHand([phone1, phone2, phone3, phone4], phone3, hand3);
  sendHand([phone1, phone2, phone3, phone4], phone4, hand4);

  gameNumber += 1;

  res.render('index', { title: 'Pinochle Shuffler' });
});



module.exports = router;
