# Memory Game Project
This is the third project in Google Udacity FEND Nanodegree Scholarship.

## Author
Made by Mariola Karpiewska based on initial, static code provided by the Udacity.

## Execution
Unzip the folders and run index.html.

## Play Rules
Find matching consecutive cards by clicking them in the right order. Try to do it in as little moves as possible. One move is accounted for each even card open. You can only see two new open cards at a time, plus those already matched.
The player starts with 3 stars rating. The rating gets decreased to 2 stars after 15 moves, and to 1 star after 25 moves.
The game can be reset any time. The reset deletes the score, shuffles the cards, and starts the new game.

## Code Description
The available card symbols are hardcoded in a cardArray. The array is shuffled before each game and a HTML code is generated based on its state. The HTML displays the cards on the deck.
The selected card symbols are consecutively stored in openCardArray, and removed from top of it if the latest two cards do not match. The comparison of the lengths of the two arrays (cardArray and openCardArray), performed after opening of each even card, allows to determine the end of the game.
The game logic is executed on each click of the card. In the meantime there is a timer code executed every second by setInterval() function. The timer is based on Date object provided by JS. It measures the time interval between begin of game and current time.

## Dependencies
The app uses jQuery and Coda font.

## Responsiveness
The card deck has been designed to scale up to the viewport size. One media query has been implemented to handle the very small viewport sizes.

## Contributing
Pull requests will be accepted occasionally, as soon as I practice to learn how to do it ;-)
