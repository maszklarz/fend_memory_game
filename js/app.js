/*
 * Create a list that holds all of your cards
 */
const cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb",
               "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let openCardArray = [];
let latestOddCard;
let latestEvenCard;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function addToOpenCardArray(cardSymbol) {
  openCardArray.push(cardSymbol);
}

function removeLastTwoCardsFromOpenCardArray() {
  openCardArray.splice(openCardArray.length-2, 2);
}

function openCard(cardObject) {
  cardObject.addClass("open show");
}

function closeCard(cardObject) {
    cardObject.removeClass("open show");
}

// assume openCardArray has even number of elements
function areLatestCardsTheSame(openCardArray) {
  if(openCardArray[openCardArray.length -1] === openCardArray[openCardArray.length -2]) {
    return true;
  } else {
    return false;
  }
}

function isGameOver() {
  if(openCardArray.length === cardArray.length) {
    return true;
  }
  else {
    return false;
  }
}

function setEventListeners() {
  $(".card").click(function(event) {
    // ignore click if unmatching cards are open
    if (latestEvenCard !== undefined)
      return;
    // ignore click on open card
    if ($(this).hasClass("open"))
      return;
    openCard( $(this) );
    addToOpenCardArray($(this).children(".fa")[0].classList[1]);
    if(openCardArray.length % 2 === 0) {
      if(areLatestCardsTheSame(openCardArray)) {
        if(isGameOver())
          alert("Game Over");
      }
      else {
        latestEvenCard = $(this);
        setTimeout(function(){
          closeCard(latestEvenCard);
          closeCard(latestOddCard);
          latestEvenCard = undefined; // stop ignoring clicks
        }, 1000);
        removeLastTwoCardsFromOpenCardArray();
      }
    }
    else {
      latestOddCard = $(this);
    }
  });
}

function generateHtml(cardArray) {
  let output = "";
  for(const card of cardArray) {
    output = `${output}
<li class="card">
  <i class="fa ${card}"></i>
</li>`;
  }
  return output;
}

$(function() {
    $(".deck li").remove();
    $(".deck").append(generateHtml(shuffle(cardArray)));
    console.log(generateHtml(cardArray));
  }
);

$(setEventListeners);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
