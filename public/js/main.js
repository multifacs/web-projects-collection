const socket = io();

let user = 0;
let score = 0;
const moveText = document.getElementById('move')
const skipBtn = document.getElementById('skip')
const scoreCount = document.getElementById('score-count')

socket.on('user', id => {
    user = id
    console.log('this user', user)
    const elem = document.getElementById('header')
    if (user == 1) {
        elem.innerHTML = 'Вы играете за крестики'
        moveText.innerHTML = 'Ваш ход'
    } else if (user == 2) {
        elem.innerHTML = 'Вы играете за нолики'
        moveText.innerHTML = 'Ход противника'
    }

    skipBtn.addEventListener('click', skipMove);
})

let turn = 0;
let turnNum = 1;

const changeText = (num) => {
    switch (num) {
        case 1:
            moveText.innerText = 'Ваш ход';
            break;
        case 2:
            moveText.innerText = 'Ход противника';
            break;
        case 3:
            moveText.innerText = 'Вы победили';
            break;
        case 4:
            moveText.innerText = 'Вы проиграли';
            break;
        default:
            moveText.innerText = '---';
    }
}

const changeScore = (num) => {
    scoreCount.innerText = num;
    score = num;
}

const checkWin = () => {
    let xFlag = false;
    let oFlag = false;
    let deadXs = 0;
    let deadOs = 0;
    if (turnNum > 4) {
        for (let i = 1; i <= 100; i++) {
            const elem = document.getElementById(i);
            if (elem.innerHTML == 'X') {
                xFlag = true;
            }
            if (elem.innerHTML == 'O') {
                oFlag = true;
            }
            if (elem.innerHTML == '+') {
                deadXs += 1;
            }
            if (elem.innerHTML == '-') {
                deadOs += 1;
            }
        }

        if (user == 1) {
            changeScore(deadOs);
        } else {
            changeScore(deadXs);
        }

        if (!xFlag) {
            if (user == 1) {
                changeText(4);
                socket.emit('loser', score);
            } else {
                changeText(3);
                socket.emit('winner', { user, score });
            }
            endGame();
        }
        if (!oFlag) {
            if (user == 1) {
                changeText(3);
                socket.emit('winner', { user, score });
            } else {
                changeText(4);
                socket.emit('loser', score);
            }
            endGame();
        }
    }
}

const canMove = (id, who) => {
    console.log(id)
    let ids = []

    switch (true) {
        case id === 1:
            ids = [id + 1, id + 10, id + 10 + 1]
            break;
        case id === 10:
            ids = [id - 1, id + 10, id + 10 - 1]
            break
        case id === 91:
            ids = [id + 1, id - 10, id - 10 + 1]
            break
        case id === 100:
            ids = [id - 1, id - 10, id - 10 - 1]
            break
        case id > 1 && id < 10:
            ids = [id + 1, id - 1, id + 10, id + 10 + 1, id + 10 - 1]
            break
        case id > 91 && id < 100:
            ids = [id + 1, id - 1, id - 10, id - 10 + 1, id - 10 - 1]
            break
        case id % 10 === 0:
            ids = [id - 1, id + 10, id + 10 - 1, id - 10, id - 10 - 1]
            break
        case id % 10 === 1:
            ids = [id + 1, id + 10, id + 10 + 1, id - 10, id - 10 + 1]
            break
        default:
            ids = [id + 1, id - 1, id + 10, id - 10, id + 10 + 1, id + 10 - 1, id - 10 + 1, id - 10 - 1]
    }
    let flag = false
    if (turn < 3 && who === 1) {
        console.log(ids)
        ids.forEach(x => {
            const elem = document.getElementById(x)
            console.log(elem.innerHTML === 'X')
            // elem.style.backgroundColor = 'red'
            if (elem.innerHTML === 'X' || elem.innerHTML === '-') {
                flag = true
            }
        })
    } else {
        ids.forEach(x => {
            const elem = document.getElementById(x)
            // elem.style.backgroundColor = 'green'
            if (elem.innerHTML === 'O' || elem.innerHTML === '+') {
                flag = true
            }
        })
    }

    return flag
}

const startGame = () => {
    document.querySelectorAll('.container > div').forEach(item => {
        item.innerHTML = ''
        item.addEventListener('click', event => {
            makeMove(event.target)
            socket.emit('move', event.target.id);
        })
    })
}

startGame()

const endGame = () => {
    document.querySelectorAll('.container > div').forEach(item => {
        item.removeEventListener('click', event => {
            makeMove(event.target)
            socket.emit('move', event.target.id);
        })
    })

    skipBtn.innerText = 'Показать результаты'
    skipBtn.removeEventListener('click', skipMove);
    skipBtn.addEventListener('click', () => {
        window.location.href = "/results.html"
    });

}

const makeMove = (elem, who = user) => {
    const id = elem.id
    console.log(elem.innerHTML == 'O')
    if (elem.innerHTML != 'X' && elem.innerHTML != 'O') {
        if (turn < 3 && who == 1) {
            if (canMove(parseInt(id), who) || (turnNum === 1 && id == 91)) {
                if (turnNum === 1) {
                    socket.emit('start');
                }
                elem.innerHTML = 'X'
                turn += 1
                turnNum += 1
            }
            console.log('turn:', turn)
        } else if (turn > 2 && turn < 6 && who == 2) {
            if (canMove(parseInt(id), who) || (turnNum === 4 && id == 10)) {
                elem.innerHTML = 'O'
                turn += 1
                turnNum += 1
            }
            console.log('turn:', turn)
            if (turn === 6) {
                turn = 0
            }
        }
    } else if (elem.innerHTML == 'X') {
        if (turn > 2 && turn < 6 && who == 2) {
            if (canMove(parseInt(id), who) || (turnNum === 4 && id == 10)) {
                elem.innerHTML = '+'
                turn += 1
                turnNum += 1
            }
            console.log('turn:', turn)
            if (turn === 6) {
                turn = 0
            }
        }
    } else if (elem.innerHTML == 'O') {
        if (turn < 3 && who == 1) {
            if (canMove(parseInt(id), who) || (turnNum === 1 && id == 91)) {
                elem.innerHTML = '-'
                turn += 1
                turnNum += 1
            }
            console.log('turn:', turn)
        }
    }

    console.log("Turn:", turn, "user:", user);

    if (turn == 3 && user == 1) {
        changeText(2);
    } else if (turn == 3 && user == 2) {
        changeText(1);
    } else if (turn == 0 && user == 2) {
        changeText(2);
    } else if (turn == 0 && user == 1) {
        changeText(1);
    }

    checkWin()
}

const skipMove = () => {
    if (turn < 3 && user == 1) {
        turn = 3
        turnNum += 1
        console.log('turn skipped')
        socket.emit('skip');
        changeText(2);
    } else if (turn > 2 && turn < 6 && user == 2) {
        turn = 0
        turnNum += 1
        console.log('turn skipped')
        socket.emit('skip');
        changeText(2);
    }
}

socket.on('bMove', ({ id, who }) => {
    console.log(id, who)
    const elem = document.getElementById(id)
    makeMove(elem, who)
})

socket.on('enemySkip', () => {
    if (turn < 3) {
        turn = 3
        turnNum += 1
        changeText(1);
    } else if (turn > 2 && turn < 6) {
        turn = 0
        turnNum += 1
        changeText(1);
    }
})