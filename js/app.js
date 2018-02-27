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
        playerTime: 0,
        t: 0,
    }

    function setBoard() {
        clearTimeout(game.t);

        game.ui.htmlDeck.innerHTML = '';
        game.ui.stars.innerHTML = '';
        game.ui.moves.innerHTML = 0;
        game.ui.time.innerHTML = '00:00';

        game.matched = [];
        game.moveCount = 0;
        setMoves(game.moveCount);

        game.ui.restart.addEventListener('click', setBoard);

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
            game.playerTime = 0;
        })();

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

    }

    function clear(array) {
        setTimeout(function() {
            array.map(function(elem) {
                elem.parentNode.classList.remove('open', 'match');
            });
        }, 300);
    }

    function match(array) {
        array.map(function(card) {
            card.parentElement.classList.add('match');
        });
    }

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
        game.ui.moves.innerHTML = game.moveCount;
    }

    function checkMatch(){
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

    function flips(event) {
        event.target.classList.add('open');
        let icon = event.target.lastElementChild;

        if (!icon.parentElement.classList.contains('match') && icon !== game.open[0]) {
            game.open.push(icon);
            checkMatch();
        }

        (game.matched.length === game.ui.htmlDeck.childElementCount) ? winLose(true): false;

    }

    function modalDisplay(message) {

        clearTimeout(game.t);

        let modal = document.querySelector('.modal'),
            text = document.createElement('p'),
            score = document.createElement('ul'),
            time = document.createElement('p'),
            moves = document.createElement('p'),
            buttons = document.createElement('span'),
            ask = document.createElement('p'),
            yes = document.createElement('button'),
            no = document.createElement('button'),
            content = document.createElement('div');

        modal.innerHTML = '';
        modal.classList.remove('hide');

        text.innerText = message;
        text.className = "modal-text";

        score.innerHTML = game.ui.stars.innerHTML;
        score.className = "score";
        (score.innerHTML.trim() == "") ? (score.innerHTML = 0) : false;

        time.innerHTML = game.playerTime;
        time.className = 'time';

        moves.innerHTML = game.moveCount;
        moves.className = 'moves';

        buttons.className = 'buttons';

        ask.innerHTML = 'Play again?';
        ask.className = 'ask';

        yes.innerHTML = 'Yeah';
        yes.classList.add("yes", "button");

        no.innerHTML = 'Nah';
        no.classList.add('no', 'button');

        content.className = "modal-content";

        content.appendChild(text);
        content.appendChild(score);
        content.appendChild(time);
        content.appendChild(moves);
        buttons.appendChild(ask);
        buttons.appendChild(yes);
        buttons.appendChild(no);
        content.appendChild(buttons);
        modal.appendChild(content);

        yes.addEventListener('click', function() {
            setBoard();
        })
        buttons.addEventListener('click', function() {
            modal.classList.toggle('hide');
        });

    };
    setBoard();

})();