// List icons for deck - Feature for user input for icon list??
let icons = [
	'fa-diamond',
	'fa-paper-plane-o',
	'fa-anchor',
	'fa-bolt',
	'fa-cube',
	'fa-leaf',
	'fa-bicycle',
	'fa-bomb'
];

// Clone icons to create matching pairs
let deck = icons.concat(icons.slice(0));

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

// Shuffle Deck
shuffle(deck);

// Loop through deck and create cards
const htmlDeck = document.querySelector('.deck');

deck.forEach(function (card) {
	let listItem = document.createElement("li");
	listItem.className = "card";
	let content = document.createElement("i");
	content.className = "fa " + card;
	listItem.appendChild(content);
	htmlDeck.appendChild(listItem);
});


// Display card icon on click
function flip (card) {
    event.stopPropagation();
    event.target.classList.add("show");

}


htmlDeck.addEventListener('click', flip);




// Validate only card clicks
htmlDeck.addEventListener('click', function(event) {
    if (event.target.nodeName === "LI") {
        flips(event);
    }
});



/*
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
