const board = document.querySelector(".chessboard");
const initialSetup = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];
for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
        let square = document.createElement("div");
        if (i % 2 !== j % 2)
            square.classList.add("black");
        else
            square.classList.add("white");
        square.textContent = initialSetup[i][j];
        square.dataset.row = i;
        square.dataset.col = j;
        board.appendChild(square);
    }
}
const prev = new Array();
const prev_pos = [];
const black_coins = ["♜", "♞", "♝", "♛", "♚", "♟"];
let move_count = 0;
const allElement = document.querySelectorAll(".chessboard div");
allElement.forEach(Element => {

    Element.addEventListener("click", () => {
        let isClicked = false;
        if (prev.length) {
            retrievColor(prev.pop());
        }
        while (prev.length) {
            let p = prev.pop();
            if (p === Element) isClicked = true;
            retrievColor(p);
        }
        let row = parseInt(Element.dataset.row);
        let col = parseInt(Element.dataset.col);

        if (Element.textContent !== "" && !isClicked && (black_coins.includes(initialSetup[row][col]) === (move_count % 2 !== 0))) {
            let val = initialSetup[row][col];
            Element.style.backgroundColor = "brown";
            if (val === "♟" || val === "♙") {
                pawn_possible_move(Element, row, col);
            }
            else if (val === "♞" || val === "♘") {
                horse_possible_move(Element, row, col);
            }
            else if (val === "♜" || val === "♖") {
                elephant_possible_move(Element, row, col);
            }
            else if (val === "♗" || val === "♝") {
                bishop_possible_move(Element, row, col);
            }
            else if (val === "♚" || val === "♔") {
                king_possible_move(Element, row, col);
            }
            else if (val === "♛" || val === "♕") {
                queen_possible_move(Element, row, col);
            }
            prev.push(Element);
            prev_pos[0] = row;
            prev_pos[1] = col;
        }
        if (isClicked) {
            move_coin(prev_pos[0], prev_pos[1], row, col);
            move_count++;
        }
    })
})

//To track pawn Move
function pawn_possible_move(Element, row, col) {
    let isblack = (initialSetup[row][col] === ("♟")) ? true : false;
    let sign = 1;
    let start = 1;
    if (!isblack) {
        sign = -1;
        start = 6;
    }
    let pos1 = [row + (sign * 1), col];
    let pos2 = [row + (sign * 2), col];
    let pos3 = [row + (sign * 1), col + 1];
    let pos4 = [row + (sign * 1), col - 1];

    if (isValid_position(pos1[0], pos1[1]) && initialSetup[pos1[0]][pos1[1]] === "") {
        let element = document.querySelector(`[data-row = "${pos1[0]}"][data-col = "${pos1[1]}"]`);
        highlight(element);
        prev.push(element);

        if (row === start && isValid_position(pos2[0], pos2[1]) && initialSetup[pos2[0]][pos2[1]] === "") {
            let element = document.querySelector(`[data-row = "${pos2[0]}"][data-col = "${pos2[1]}"]`);
            highlight(element);
            prev.push(element);
        }
    }
    if (isValid_position(pos3[0], pos3[1]) && isFight_position(pos3[0], pos3[1], isblack, black_coins.includes(initialSetup[pos3[0]][pos3[1]]))) {
        let element = document.querySelector(`[data-row = "${pos3[0]}"][data-col = "${pos3[1]}"]`);
        coin_kill_highlight(element);
        prev.push(element);
    }
    if (isValid_position(pos4[0], pos4[1]) && isFight_position(pos4[0], pos4[1], isblack, black_coins.includes(initialSetup[pos4[0]][pos4[1]]))) {
        let element = document.querySelector(`[data-row = "${pos4[0]}"][data-col = "${pos4[1]}"]`);
        coin_kill_highlight(element);
        prev.push(element);
    }

}

//to track Horse Move
function horse_possible_move(Element, row, col) {
    let direction = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
    let isblack = black_coins.includes(initialSetup[row][col]);
    for (let [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            let piece = initialSetup[r][c];
            let temp = document.querySelector(`[data-row = "${r}"][data-col = "${c}"]`);
            if (piece === "") {
                highlight(temp);
                prev.push(temp);
            }
            else if (isblack !== black_coins.includes(piece)) {
                coin_kill_highlight(temp);
                prev.push(temp);
            }
        }
    }
}

//To track Bishop Move
function bishop_possible_move(Element, row, col) {
    let isblack = black_coins.includes(initialSetup[row][col]);
    let direction = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r <= 7 && c <= 7 && c >= 0) {
            let piece = initialSetup[r][c];
            let temp = document.querySelector(`[data-row = "${r}"][data-col = "${c}"]`);
            if (piece === "") {
                highlight(temp);
                prev.push(temp);
            }
            else {
                if (isblack !== black_coins.includes(piece)) {
                    coin_kill_highlight(temp);
                    prev.push(temp);
                }
                break;
            }
            r += dr;
            c += dc;
        }
    }
}

//To track Kings Move
function king_possible_move(Element, row, col) {
    let isblack = initialSetup[row][col] === '♚';
    let direction = [[-1, 0], [-1, -1], [1, 0], [1, 1], [-1, 1], [1, -1], [0, -1], [0, 1]];
    for (let [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        if (r >= 0 && r <= 7 && c <= 7 && c >= 0) {
            let piece = initialSetup[r][c];
            let temp = document.querySelector(`[data-row = "${r}"][data-col = "${c}"]`);
            if (piece === "") {
                highlight(temp);
                prev.push(temp);
            }
            else if (isblack !== black_coins.includes(piece)) {
                coin_kill_highlight(temp);
                prev.push(temp);
            }
        }
    }
}

//To track Queens Move
function queen_possible_move(Element, row, col) {
    elephant_possible_move(Element, row, col);
    bishop_possible_move(Element, row, col);
}

//To track Elephants Move
function elephant_possible_move(Element, row, col) {
    let isblack = black_coins.includes(initialSetup[row][col]);
    let direction = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r <= 7 && c <= 7 && c >= 0) {
            let piece = initialSetup[r][c];
            let temp = document.querySelector(`[data-row = "${r}"][data-col = "${c}"]`);

            if (piece === "") {
                highlight(temp);
                prev.push(temp);
            }
            else {
                if (isblack !== black_coins.includes(piece)) {
                    coin_kill_highlight(temp);
                    prev.push(temp);
                }
                break;
            }
            r += dr;
            c += dc;
        }
    }
}


function move_coin(row1, col1, row2, col2) {
    initialSetup[row2][col2] = initialSetup[row1][col1];
    initialSetup[row1][col1] = "";
    update_coin();
}


function isValid_position(row, col) {
    if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
        return true;
    }
    return false;
}

function isFight_position(row, col, isblack, isopponentBlack) {
    if (initialSetup[row][col] !== "" && isblack !== isopponentBlack) {
        return true;
    }
    return false;
}


function update_coin() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            let temp = document.querySelector(`[data-row = "${i}"][data-col = "${j}"]`);
            temp.textContent = initialSetup[i][j];
        }
    }
}


function highlight(element) {
    element.style.backgroundColor = "rgba(0, 160, 0 , 0.5";
}


function coin_kill_highlight(element) {
    element.style.backgroundColor = "red";
}


function retrievColor(element) {
    element.style.backgroundColor = "";
}