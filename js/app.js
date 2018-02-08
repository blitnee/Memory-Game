(function playGame() {

    let open = [];
    let matched = [];
    let count = 3;

    const htmlDeck = document.querySelector('.deck');
    const restart = document.querySelector('.restart');
    const moves = document.querySelector('.moves');
    const stars = document.querySelector('.stars');

    function setBoard(count) {

        // List icons for deck 
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
            let currentIndex = array.length, temporaryValue, randomIndex;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        shuffle(deck);

        // Loop thorugh deck and create HTML cards
        deck.map(function (card) {
            let listItem = document.createElement("li");
            listItem.className = "card";
            let content = document.createElement("i");
            content.className = "fa " + card;
            listItem.appendChild(content);
            htmlDeck.appendChild(listItem);
        });

        // Build HTML stars on start
        (function setStars(count) {
            for (i = 0; i < count; i++) {
                let star = document.createElement("li");
                let content = document.createElement("i");
                content.className = "fa fa-star";
                star.appendChild(content);
                stars.appendChild(star);
            }
        })(count);
    }

    // Clear cards with game play classes
    function clear(array) {
        setTimeout(function () {
            array.map(function(elem) {
                elem.parentNode.classList.remove('show', 'open', 'match');
            });
        }, 500);
    }

    // Show matched cards
    function match(array) {
        array.map(function (card) {
            card.parentElement.classList.add('match');
        });
    }

    // Push matches out of open
    function pushMatched(array) {
        array.map(function(elem) {
            matched.push(elem);
        })
    }

deck.forEach(function (card) {
	let listItem = document.createElement("li");
	listItem.className = "card";
	let content = document.createElement("i");
	content.className = "fa " + card;
	listItem.appendChild(content);
	htmlDeck.appendChild(listItem);
});


let open = [];
let matched = [];

// Display card icon on click
function flips (event) {
    event.target.classList.add('show');
    let icon = event.target.lastElementChild;

    // Validate card has not been clicked before and is not self
    if (icon.parentElement.classList.contains('.show') || icon === open[0]) {
        // Do nothing
    } else {
        open.push(icon);
    }
    
    if (open.length === 2) {
        if (open[0].className === open[1].className) {
            open.forEach(function(elem) {
                matched.push(elem);
            })
        } else {
            // Add CSS annimation response
            open.forEach(function(elem) {
                elem.parentNode.classList.remove('show');
            });
        }

    	open = [];
    } 
}

// Validate only card clicks
htmlDeck.addEventListener('click', function(event) {
    if (event.target.nodeName === "LI") {
        flips(event);
    }
});

// Clear cards with .show
function clear (array) {
    array.forEach(function(elem) {
        elem.parentNode.classList.remove('show');
    });
}





/*
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
