/*
 * Create a list that holds all of your cards
 */
const cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb",
               "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let openCardArray = [];
let latestOddCard;
let latestEvenCard;
let clickCounter = 0;
let moveCounter = 0;
let startGameDate;
let timeEndGame;


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
// the caller takes care about it
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

// these event listeners are on html elements that are not deleted on new game
function setEventListenersForAPage() {
  $(".restart").click(function(event) {
    if(confirm("Start new game?"))
      startGame();
  });
}

// these event listeners need to be recreated on each game
function setEventListenersForAGame() {
  $(".card").click(function(event) {
    // ignore click if unmatching cards are open
    if (latestEvenCard !== undefined)
      return;
    // ignore click on open card
    if ($(this).hasClass("open"))
      return;
    // at this point we know the click is valid and needs to be processed
    openCard($(this));
    addToOpenCardArray($(this).children(".fa")[0].classList[1]);
    if(openCardArray.length % 2 === 0) {
      moveCounter++;
      // display moveCounter on board
      $(".moves").html(moveCounter);
      if(areLatestCardsTheSame(openCardArray)) {
        if(isGameOver()) {
          timeEndGame = getCurrentTimeInterval();
          // display end-of-game modal with slight delay
          // to let card animations finish
          setTimeout(function() {
            alert("Congratulations! You won in "+  moveCounter + " moves. Your time is " + timeEndGame + ". Your star rating is " + movesStars(moveCounter) + ". Do you want to start a new game?");
            startGame();
          }, 1000);
        }
      }
      else {
        latestEvenCard = $(this);
        // close two latest cards with slight delay
        // so the player can acknowledge they are different
        setTimeout(function(){
          closeCard(latestEvenCard);
          closeCard(latestOddCard);
          // stop ignoring clicks
          latestEvenCard = undefined;
        }, 1000);
        removeLastTwoCardsFromOpenCardArray();
      }
    }
    else {
      latestOddCard = $(this);
    }
    // calculate star count based on move count and redraw the stars
    drawStars(movesStars(moveCounter));
  });
}

// convert move count to star count
function movesStars(moveCounter) {
  return moveCounter <= 15 ? 3 : (moveCounter <= 25 ? 2 : 1);
}

// Get time interval between begin of game and current time
function getCurrentTimeInterval() {
  const now = new Date().getTime();
  const timeDiff = now - startGameDate;
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

// display the timer
function updateTime() {
  $(".time").html(getCurrentTimeInterval());
}

// reset the timer
function startTime() {
  startGameDate = new Date().getTime();
}

function drawStars(starCount) {
  $(".stars li").remove();
  for(; starCount > 0; starCount--)
    $(".stars").append("<li><i class='fa fa-star'></i></li>");
}

// generate cards in html format
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

function startGame() {
  // clear board
  $(".deck li").remove();
  // add cards to the board
  $(".deck").append(generateHtml(shuffle(cardArray)));
  // set listeners on cards recreated for the game
  setEventListenersForAGame();
  moveCounter = 0;
  // display move counter on board
  $(".moves").html(moveCounter);
  // display stars based on moves
  drawStars(movesStars(moveCounter));
  // reset the timer
  startTime();
  // display the timer for the first time in the game
  updateTime();
  // keep displaying the timer avery second
  setInterval(updateTime,1000);
}

// initialize page and start the very first game
$(function() {
    setEventListenersForAPage(); // no need to reinitialize them with each new game
    startGame();
  }
);



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
