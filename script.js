const screen = document.getElementById('screen')
const context = screen.getContext('2d')

const images = {
    gameover: new Image(),
    doubt: new Image(),
    empty: new Image(),
    bomb: new Image(),
    flag: new Image(),
    hidden: new Image(),
    presed_bomb: new Image(),
    wong_flag: new Image(),
    numbers: []
}
const field = []
const width = 20
const height = 20
const bombsCount = 50
var isGameStarted = false
var isGameOver = false

init()

function init() {
    screen.addEventListener('contextmenu', event => event.preventDefault())
    initField()
    importImages()
    draw()
}

function draw() {
    context.fillStyle = 'white'
    context.fillRect(0, 0, screen.width, screen.height)
    for (i in field) {
        for (j in field[i]) {
            if (isGameOver) {
                if (field[i][j].bomb && !field[i][j].hidden) {
                    context.drawImage(images.presed_bomb, i * 24, j * 24, 24, 24)
                } else if (field[i][j].bomb && field[i][j].flag) {
                    context.drawImage(images.flag, i * 24, j * 24, 24, 24)
                } else if (field[i][j].bomb && !field[i][j].flag) {
                    context.drawImage(images.bomb, i * 24, j * 24, 24, 24)
                } else if (!field[i][j].bomb && field[i][j].flag) {
                    context.drawImage(images.wong_flag, i * 24, j * 24, 24, 24)
                } else if (field[i][j].number > 0) {
                    context.drawImage(images.numbers[field[i][j].number], i * 24, j * 24, 24, 24)
                } else {
                    context.drawImage(images.empty, i * 24, j * 24, 24, 24)
                }
            } else
                if (field[i][j].hidden) {
                    if (field[i][j].flag) {
                        context.drawImage(images.flag, i * 24, j * 24, 24, 24)
                    } else if (field[i][j].doubt) {
                        context.drawImage(images.doubt, i * 24, j * 24, 24, 24)
                    } else {
                        context.drawImage(images.hidden, i * 24, j * 24, 24, 24)
                    }
                } else {
                    if (field[i][j].bomb) {
                        context.drawImage(images.presed_bomb, i * 24, j * 24, 24, 24)
                    } else if (field[i][j].number > 0) {
                        context.drawImage(images.numbers[field[i][j].number], i * 24, j * 24, 24, 24)
                    } else {
                        context.drawImage(images.empty, i * 24, j * 24, 24, 24)
                    }
                }
        }
    }
    if (isGameOver) {
        context.drawImage(images.gameover, 0, 0, 480, 480)
    }
    requestAnimationFrame(draw)
}

function resetBombs(cx, cy) {
    for (var i = 0; i < bombsCount; i++) {
        var x = Number.parseInt(Math.random() * width)
        var y = Number.parseInt(Math.random() * height)
        if (field[x][y].bomb || (x - cx) * (x - cx) + (y - cy) * (y - cy) <= 2) {
            i--
        } else {
            setBomb(x, y)
        }
    }
}

function setBomb(x, y) {
    field[x][y].bomb = true
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var dx = x + i
            var dy = y + j
            if (dx < 0) continue
            if (dy < 0) continue
            if (dx >= width) continue
            if (dy >= height) continue
            field[x + i][y + j].number++
        }
    }
}

function initField() {
    for (var i = 0; i < width; i++) {
        field[i] = []
        for (var j = 0; j < height; j++) {
            field[i][j] = { bomb: false, hidden: true, doubt: false, flag: false, number: 0 }
        }
    }
}

function importImages() {
    for (i in images) {
        if (i == "numbers") {
            for (var j = 0; j < 9; j++) {
                images.numbers[j] = new Image()
                images.numbers[j].src = "_images/numbers/" + j + ".png"
            }
        } else {
            images[i].src = "_images/" + i + ".png"
        }
    }
}

function leftClick(x, y) {
    if (!isGameStarted) {
        initField()
        resetBombs(x, y)
        isGameOver = false
        isGameStarted = true

    }
    if (isGameOver) {
        isGameOver = false
        isGameStarted = false
        initField()
        return
    }
    var button = field[x][y]
    if (button.flag) return
    else if (!button.hidden) return
    else if (button.bomb) {
        button.hidden = false
        isGameOver = true
        started = false
    } else if (button.number > 0) {
        button.hidden = false
    } else {
        var pryStack = [{ x: x, y: y }]
        var secStack = []
        while (pryStack.length) {
            while (pryStack.length) {
                var a = pryStack.pop()
                field[a.x][a.y].hidden = false
                for (var i = -1; i < 2; i++) {
                    for (var j = -1; j < 2; j++) {
                        var dx = a.x + i
                        var dy = a.y + j
                        if (dx < 0) continue
                        if (dy < 0) continue
                        if (i == 0 && j == 0) continue
                        if (dx >= width) continue
                        if (dy >= height) continue
                        if (!field[dx][dy].hidden) continue
                        if (field[dx][dy].number) {
                            field[dx][dy].hidden = false
                            continue
                        }
                        secStack.push({ x: dx, y: dy })
                    }
                }
            }
            while (secStack.length) {
                pryStack.push(secStack.pop())
            }
        }
    }
}

function rightClick(x, y) {
    if (isGameOver) return
    if (field[x][y].flag) {
        field[x][y].flag = false
        field[x][y].doubt = true
    } else if (field[x][y].doubt) {
        field[x][y].doubt = false
    } else {
        field[x][y].flag = true
    }
}

screen.addEventListener('mousedown', function (e) {
    var x = Number.parseInt((e.offsetX) / 24)
    var y = Number.parseInt((e.offsetY) / 24)
    if (e.button == 0) {
        leftClick(x, y)
    } else if (e.button == 2) {
        rightClick(x, y)
    }
})
