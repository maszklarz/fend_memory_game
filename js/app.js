/*
 * Create a list that holds all of your cards
 */
const cardArray = ["bratki", "gozdzik", "gwiazda-betlejemska", "narcyzy", "niezapominajki", "stokrotki", "zajac", "margaretki",
                   "bratki", "gozdzik", "gwiazda-betlejemska", "narcyzy", "niezapominajki", "stokrotki", "zajac", "margaretki"];
const hallOfFame = [];
const maxHallOfFameLength = 10;
let openCardArray = [];
let latestOddCard;
let latestEvenCard;
let clickCounter = 0;
let moveCounter = 0;
let startGameDate;
let timeEndGame;
let timerHandle;
let latestName = "Player";

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

/*
   Add new record to the proper position of hallOfFame[].
   Return the position (0 based) or -1 if beyond maxHallOfFameLength.
   Sort order: time (to seconds), moves.
*/
function addToHallOfFame(newName, newMoves, newTime) {
  let ff = 0;
  for(; ff<hallOfFame.length; ff++) {
    if(newTime < hallOfFame[ff].time ||
       (newTime === hallOfFame[ff].time && newMoves < hallOfFame[ff].moves)) {
      break;
    }
  }
  if(ff < maxHallOfFameLength) {
    hallOfFame.splice(ff, 0, {name: newName, moves: newMoves, time: newTime});
  }
  // cut off eleventh element if exists
  hallOfFame.splice(maxHallOfFameLength, 1);
  return (ff<maxHallOfFameLength ? ff : -1);
}

/*
  Create a html string based on hallOfFame[]
  Initially display edit box on editPos position.
  Set eventHandler for Enter key to modify the name,
    hide the display box
    and show fixed string of the entered name.
  Display the html string in the end of game modal.
*/
function completeHallOfFame(editPos) {
  let out = "";
  let posProperty = "";
  let editWidget = "";
  for(let ff=0; ff<hallOfFame.length; ff++) {
    if(ff === editPos) {
      posProperty = ' id="name-fixed" class="rec-name rec-hide"';
      editWidget = '<input id="name-edit" class="rec-name" type="text" width="40%" value="'+ hallOfFame[ff].name +'"/>';
    }
    else {
      posProperty = 'class="rec-name"';
      editWidget = '';
    }
    out += `<li class="li-rec"><div class="record"><div ${posProperty}>${hallOfFame[ff].name}</div>${editWidget}
 <div class="rec-time">${formatTimeInterval(hallOfFame[ff].time)}</div>
 <div class="rec-moves">${hallOfFame[ff].moves}</div>
 </div></li>`
  }

  // insert the html string to the end of game modal
  $(".modal-hall-of-fame").html(out);

  // Create the event handler for Enter key
  $("#name-edit").keyup(function(event) {
    if (event.keyCode === 13) {
        hallOfFame[editPos].name = $("#name-edit").val();
        $("#name-fixed").html(hallOfFame[editPos].name);
        $("#name-edit").addClass("rec-hide");
        $("#name-fixed").removeClass("rec-hide");
        // keep the name to suggest it at the next round
        latestName = hallOfFame[editPos].name;
    }
  });
}

function addToOpenCardArray(cardSymbol) {
  openCardArray.push(cardSymbol);
}

function removeLastTwoCardsFromOpenCardArray() {
  openCardArray.splice(openCardArray.length-2, 2);
}

function openCard(cardObject) {
  cardObject.addClass("open show");

  cardObject.children()[0].classList.add("card-open");
  cardObject.children()[1].classList.remove("card-open");
}

function closeCard(cardObject) {
  cardObject.removeClass("open show");

  cardObject.children()[0].classList.remove("card-open");
  cardObject.children()[1].classList.add("card-open");
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
    if(confirm("Start new game?")) {
      // stop the timer
      clearInterval(timerHandle);
      startGame();
    }
  });

  $(".modal-close").click(function() {
    $("#end-of-game-modal").hide("slow");
    startGame();
  });
}

// these event listeners need to be recreated on each game
function setEventListenersForAGame() {
  $(".card-outer").click(function(event) {
    // ignore click if unmatching cards are open
    if (latestEvenCard !== undefined)
      return;
    // ignore click on open card
    if ($(this).hasClass("open"))
      return;
    // turn on the timer on the very first click
    if(moveCounter === 0 && openCardArray.length === 0) {
      startTime();
      timerHandle = setInterval(updateTime, 1000);
    }
    // at this point we know the click is valid and needs to be processed
    openCard($(this));
    addToOpenCardArray($(this).children()[0].classList[0]);
    if(openCardArray.length % 2 === 0) {
      moveCounter++;
      // display moveCounter on board
      $(".moves").html(moveCounter);
      if(areLatestCardsTheSame(openCardArray)) {
        if(isGameOver()) {
          // stop the timer
          clearInterval(timerHandle);
          // display end-of-game modal
          let winnerPos = addToHallOfFame(latestName, moveCounter, timeEndGame);
          // update winner name and display the new hall of fame
          completeHallOfFame(winnerPos);
          $(".end-of-game-modal-content p").html("Congratulations! You won in " +
            moveCounter + " moves. Your time is " +
            formatTimeInterval(timeEndGame) + ". Your star rating is " +
            movesStars(moveCounter) + ". " +
            (winnerPos < 0 ? "You did not make it to the Hall of Fame this time. Next time should be better!" : "You made it to the Hall of Fame! Enter your name and keep rolling! ")
            + " Do you want to start a new game?");
          $("#end-of-game-modal").show("slow");
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
  return now - startGameDate;
}

function formatTimeInterval(timeDiff) {
  const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
  const seconds = Math.floor(timeDiff % 60);
  return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

// display the timer
function updateTime() {
  timeEndGame = Math.floor(getCurrentTimeInterval() / 1000);
  $(".time").html( formatTimeInterval(timeEndGame) );
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
<div class="card-outer">
  <i class="${card} card-front"><img src="img/${card}.jpg"></i><i class="card-back card-open"><img src="img/seed.jpg"></i>
</div>`;
  }
  return output;
}

function startGame() {
  // initially clear the list of opened cards
  openCardArray.splice(0);
  // clear board
  $(".deck div").remove();
  // add cards to the board
  $(".deck").append(generateHtml(shuffle(cardArray)));
  // set listeners on cards recreated for the game
  setEventListenersForAGame();
  moveCounter = 0;
  // display move counter on board
  $(".moves").html(moveCounter);
  // display stars based on moves
  drawStars(movesStars(moveCounter));
  // show initial zero timer
  $(".time").html("00:00");
}

// initialize page and start the very first game
$(function() {
    setEventListenersForAPage(); // no need to reinitialize them with each new game
    $("#end-of-game-modal").hide();
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
