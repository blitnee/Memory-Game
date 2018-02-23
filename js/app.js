(function playGame() {

    const game = {
        open: [],
        matched: [],
        moveCount: 0,
        ui: {
            htmlDeck: document.querySelector('.deck'),
            restart: document.querySelector('.restart'),
            moves: document.querySelector('.moves'),
            stars: document.querySelector('.stars'),
            time: document.querySelector('.timer'),
        },
        seconds: 0,
        minutes: 0,
        hours: 0,
        playerTime: null,
        t: null,
    }

    function setTimer() {
        game.ui.htmlDeck.removeEventListener('click', setTimer);

        function add() {
            game.seconds++;
            if (game.seconds >= 60) {
                game.seconds = 0;
                game.minutes++;
                if (game.minutes >= 60) {
                    game.minutes = 0;
                }
            }
            game.ui.time.textContent = (game.minutes ? (game.minutes > 9 ? game.minutes : "0" + game.minutes) : "00") + ":" + (game.seconds > 9 ? game.seconds : "0" + game.seconds);
            ((game.minutes === 00 && game.seconds === 31) || (game.minutes === 00 && game.seconds === 46) || (game.minutes === 01 && game.seconds === 01)) ? game.ui.stars.removeChild(game.ui.stars.lastElementChild) : false;
            (game.minutes === 02) ? winLose() : false;
            timer();
            return game.playerTime = game.ui.time.textContent;
        }

        function timer() {
            game.t = setTimeout(add, 1000);
        }
        timer();
    };

    function setBoard() {
        game.ui.htmlDeck.innerHTML = '';
        game.ui.stars.innerHTML = '';
        game.ui.moves.innerHTML = 0;
        game.ui.time.innerHTML = '00:00';

        game.ui.restart.addEventListener('click', gameOver);

        game.ui.htmlDeck.addEventListener('click', setTimer);

        // Validate only card clicks
        game.ui.htmlDeck.addEventListener('click', function(event) {
            (event.target.nodeName === "LI") ? flips(event): false;
        });

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
        let deck = icons.concat(icons);

        // Shuffle function from http://stackoverflow.com/a/2450976
        function shuffle(array) {
            let currentIndex = array.length,
                temporaryValue, randomIndex;

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
        deck.map(function(card) {
            let listItem = document.createElement("li"),
                content = document.createElement("i");
            listItem.className = "card";
            content.className = "fa " + card;
            listItem.appendChild(content);
            game.ui.htmlDeck.appendChild(listItem);
        });

        // Build HTML stars on start
        (function setStars() {
            for (i = 0; i < 3; i++) {
                let star = document.createElement("li"),
                    content = document.createElement("i");
                content.className = "fa fa-star";
                star.appendChild(content);
                game.ui.stars.appendChild(star);
            }
        })();

        (function resetTime() {
            game.seconds = 0;
            game.minutes = 0;
            game.hours = 0;
        })();

    }

    // Clear cards with game play classes
    function clear(array) {
        setTimeout(function() {
            array.map(function(elem) {
                elem.parentNode.classList.remove('show', 'open', 'match');
            });
        }, 500);
    }

    function match(array) {
        array.map(function(card) {
            card.parentElement.classList.add('match');
        });
    }

    // Push matches out of open
    function pushMatched(array) {
        array.map(function(elem) {
            game.matched.push(elem);
        })
    }

    function winLose(win) {
        let message = (win ? 'You win!' : 'Let\'s try that again...');

        setTimeout(function() {
            modalDisplay(message);
        }, 200);
    };

    function moveCounter() {
        game.moveCount++;
        setMoves(game.moveCount);
    }

    function setMoves(moves) {
        game.ui.moves.innerHTML = game.moveCount; // move to game block?
    }

    function gameOver() {
        game.matched = [];
        game.moveCount = 0;
        setMoves(game.moveCount);
        setBoard();
    }

    // Workflow for card flip on click
    function flips(event) {
        event.target.classList.add('show', 'open');
        let icon = event.target.lastElementChild;

        // Validate card has not been matched and is not self
        if (!icon.parentElement.classList.contains('match') && icon !== game.open[0]) {
            game.open.push(icon);
            // Identify match when two cards are opened
            if (game.open.length === 2) {
                if (game.open[0].className === game.open[1].className) {
                    match(game.open);
                    pushMatched(game.open);
                } else {
                    clear(game.open);
                    moveCounter();
                }
                game.open = [];
            }
        }

        (game.matched.length === game.ui.htmlDeck.childElementCount) ? winLose(true): false;
        (game.moves === 6) ? winLose(): false;

    }

    // Display message, score, and time in modal
    function modalDisplay(message) {
        game.ui.time.classList.toggle('hide');

        let modal = document.querySelector('.modal'),
            close = document.createElement('span'),
            text = document.createElement('p'),
            score = document.createElement('ul'),
            playTime = document.createElement('span'),
            content = document.createElement('div');

        modal.innerHTML = '';
        modal.classList.remove('hide');

        close.innerHTML = 'x';
        close.className = 'close';

        text.innerText = message;
        text.className = "modal-text";

        score.innerHTML = game.ui.stars.innerHTML;
        score.className = "score";
        (score.innerHTML.trim() == "") ? (score.innerHTML = 0) : false;

        playTime.innerHTML = game.playerTime;

        content.className = "modal-content";

        content.appendChild(close);
        content.appendChild(text);
        content.appendChild(score);
        content.appendChild(playTime);
        modal.appendChild(content);

        close.addEventListener('click', function() {
            modal.classList.toggle('hide');
            gameOver();
            game.ui.time.classList.toggle('hide');
        });

    };
    setBoard();

})();