(function playGame() {

    let open = [],
        matched = [],
        count = 3;

    const htmlDeck = document.querySelector('.deck'),
          restart = document.querySelector('.restart'),
          moves = document.querySelector('.moves'),
          stars = document.querySelector('.stars');

    function setBoard(count) {
        htmlDeck.innerHTML = '';
        stars.innerHTML = '';

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
            let listItem = document.createElement("li"),
                content = document.createElement("i");
            listItem.className = "card";
            content.className = "fa " + card;
            listItem.appendChild(content);
            htmlDeck.appendChild(listItem);
        });

        // Build HTML stars on start
        (function setStars(count) {
            for (i = 0; i < count; i++) {
                let star = document.createElement("li"),
                    content = document.createElement("i");
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

    function winLose(win) {
        let message = (win ? 'You win!' : 'Let\'s try that again...');

        setTimeout(function () {
            modalDisplay(message);
            gameOver();
        }, 200);
    };

    // Reduce moves and stars on board
    function reduceCount() {
        count--;
        stars.removeChild(stars.lastElementChild);
        setMoves(count);
    }

    function setMoves(count) {
        moves.innerHTML = count;
    }

    function gameOver() {
        //htmlDeck.innerHTML = '';
        //stars.innerHTML = '';
        matched = [];
        count = 3;
        setMoves(count);
        setBoard(count);
        resetTime();
    }

    restart.addEventListener('click', gameOver);

    // Validate only card clicks
    htmlDeck.addEventListener('click', function(event) {
        (event.target.nodeName === "LI") ? flips(event) : false;
    });

    // Workflow for card flip on click
    function flips(event) {

        event.target.classList.add('show', 'open');
        let icon = event.target.lastElementChild;

        // Validate card has not been clicked before and is not self
        if (!icon.parentElement.classList.contains('.show') && icon !== open[0]) {
            open.push(icon);
            // Identify match or lost turn when two cards are opened
            if (open.length === 2) {
                if (open[0].className === open[1].className) {
                    match(open);
                    pushMatched(open);
                } else {
                    clear(open);
                    reduceCount();
                }
                open = [];
            } 
        }

        (matched.length === htmlDeck.childElementCount) ? winLose(true) : false;
        (count === 0) ? winLose() : false;
    }

    const time = document.querySelector('.timer');
    let seconds = 0, 
        minutes = 0, 
        hours = 0,
        playerTime;

    function setTime (t) {

        function add() {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
            time.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
            timer();
            return playerTime = time.textContent;
        }

        function timer(t) {
            t = setTimeout(add, 1000);
        }
        timer();
    };
    setTime();

    function resetTime () {
        seconds = 0;
        minutes = 0;
        hours = 0;
    };

    // Display message, score, and time in modal
    function modalDisplay(message) {

        time.classList.toggle('hide');

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

        score.innerHTML = stars.innerHTML;
        score.className = "score";
        (score.innerHTML.trim() == "") ? (score.innerHTML = 0) : false;

        playTime.innerHTML = playerTime;

        content.className = "modal-content";
        
        content.appendChild(close);
        content.appendChild(text);
        content.appendChild(score);
        content.appendChild(playTime);
        modal.appendChild(content);

        close.addEventListener('click', function () {
            modal.classList.toggle('hide');
            resetTime();
            time.classList.toggle('hide');
        });

    };

    setBoard(count);

})();
