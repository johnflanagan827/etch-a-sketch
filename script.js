// CONSTANTS
const container = document.getElementById('sketch-container');
const clear = document.getElementById('clear');
const number = document.getElementById('number');
const colorWheel = document.getElementById('color-wheel');
const standard = document.getElementById('standard-mode');
const rainbow = document.getElementById('rainbow-mode');
const eraser = document.getElementById('eraser');
const length = document.getElementById('length');
const colors = ['rgb(255, 0, 24)', 'rgb(255, 165, 44)', 'rgb(255, 255, 65)', 'rgb(0, 128, 24)', 'rgb(0, 0, 249)', 'rgb(134, 0, 125)'];

// VARIABLES
let eraseMode = false;
let rainbowMode = false;
let isDragging = false;
let sizeConstant = 35;
let timer = 0;
let divArr = [];

// FUNCTIONS
// returns a random rgb color
function randColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

// creates an empty board of specified size
function createBoard(size) {
    divArr = [];
    container.innerHTML = '';
    for (i = 0; i < size; i++) {
        const subcontainer = document.createElement('div');
        subcontainer.style.display = 'flex';
        container.appendChild(subcontainer);
        for (j = 0; j < size; j++) {
            const div = document.createElement('div');
            div.setAttribute('style', `background: white; height: ${sizeConstant / size}rem; width: ${sizeConstant / size}rem; border: 0.1rem solid black; box-sizing: border-box;`);
            div.className = 'box';
            subcontainer.appendChild(div);
            divArr.push(div);
        }
    }
}

// allows board to be colored
function color() {
    let currDiv = divArr[0];

    divArr.forEach((e) => {
        e.addEventListener('mousedown', () => {
            isDragging = true;
            currDiv = e;

            if (eraseMode) {
                e.style.background = 'white';
            } else if (rainbowMode) {
                e.style.background = randColor();
            } else {
                e.style.background = colorWheel.value;
            }
        });

        e.addEventListener('mousemove', () => {
            if (isDragging && e != currDiv) {
                if (eraseMode) {
                    e.style.background = 'white';
                } else if (rainbowMode) {
                    e.style.background = randColor();
                } else {
                    e.style.background = colorWheel.value;
                }
                currDiv = e;
            }
        });
    });
}

// updates the max size of board depending on screen size
function updateSizeConstant() {
    if (window.innerWidth <= 600) {
        sizeConstant = 17;
        number.max = 16;
    } else if (window.innerWidth <= 800) {
        sizeConstant = 25;
        number.max = 25;
    } else {
        sizeConstant = 35;
        number.max = 49;
    }
}

// rainbow cycling animation
function rainbowCycle() {
    rainbow.style.background = randColor();
    timer = setTimeout(function () {
        rainbowCycle();
    }, 350);
}


// EVENT LISTENERS
document.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('resize', () => {
    updateSizeConstant();
    const boxes = document.getElementsByClassName('box');
    for (i = 0; i < boxes.length; i++) {
        boxes[i].style.height = `${sizeConstant / number.value}rem`;
        boxes[i].style.width = `${sizeConstant / number.value}rem`;
    }
})

number.addEventListener('input', () => {
    length.textContent = `${number.value} x ${number.value}`;
    createBoard(number.value);
    color();
});

clear.addEventListener('click', () => {
    divArr.forEach((e) => {
        e.style.background = 'white';
    });
});

standard.addEventListener('click', () => {
    rainbowMode = false;
    eraseMode = false;
});

rainbow.addEventListener('click', () => {
    rainbowMode = true;
    eraseMode = false;
});

rainbow.addEventListener('mouseenter', () => {
    if (!timer) {
        rainbowCycle();
    }
});

rainbow.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    timer = 0;
    rainbow.style.background = '#f8f9fa';
});

eraser.addEventListener('click', () => {
    eraseMode = true;
});

// START CONDITIONS
updateSizeConstant();
createBoard(number.value);
color();