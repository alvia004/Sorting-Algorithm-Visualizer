// selecting all elements
let randomBtn = document.getElementById("randomBtn");
let customBtn = document.getElementById("customBtn");

let algorithm = document.getElementById("algorithm");
let speed = document.getElementById("speed");

let barsContainer = document.getElementById("barsContainer");

let comparisons = document.getElementById("comparisons");
let swaps = document.getElementById("swaps");
let status = document.getElementById("status");

let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");

// algorithm info
let algorithmTitle = document.querySelector(".algorithm-info h2");
let algorithmDescription = document.querySelector(".algorithm-info p");

// store numbers
let numbers = [];

// default stats
let comparisonCount = 0;
let swapCount = 0;

// sorting control
let isSorting = false;


// wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// reset stats
function resetStats() {
    comparisonCount = 0;
    swapCount = 0;

    comparisons.textContent = 0;
    swaps.textContent = 0;
}


// generate random array
randomBtn.addEventListener("click", function () {

    // don't generate while sorting
    if (isSorting) return;

    // clear old numbers
    numbers = [];

    // reset stats
    resetStats();

    status.textContent = "Ready";

    // generate 10 random numbers
    for (let i = 0; i < 10; i++) {

        // create random number
        let randomNumber =
            Math.floor(Math.random() * 100) + 1;

        numbers.push(randomNumber);
    }

    // show bars
    renderBars();

    console.log("Random:", numbers);
});


// convert numbers into bars
function renderBars() {

    // remove old bars
    barsContainer.innerHTML = "";

    // create a bar for every number
    numbers.forEach(function (number) {

        let bar = document.createElement("div");

        bar.classList.add("bar");

        // set bar height
        bar.style.height = number + "%";

        // show number
        let value = document.createElement("span");

        value.textContent = number;

        bar.appendChild(value);

        // add bar to container
        barsContainer.appendChild(bar);
    });
}


// custom numbers
customBtn.addEventListener("click", function () {

    // don't enter numbers while sorting
    if (isSorting) return;

    let userInput =
        prompt("Enter numbers separated by commas:");

    // if cancel is pressed
    if (userInput === null) return;

    numbers = userInput
        .split(",")
        .map(Number)
        .filter(number => !isNaN(number));

    // reset stats
    resetStats();

    status.textContent = "Ready";

    // show bars
    renderBars();

    console.log("Custom:", numbers);
});


// update algorithm info
algorithm.addEventListener("change", function () {

    if (isSorting) return;

    // bubble sort selected
    if (algorithm.value === "bubble") {

        algorithmTitle.textContent = "Bubble Sort";

        algorithmDescription.textContent =
            "Repeatedly compares adjacent values and swaps them when they are in the wrong order.";
    }

    // selection sort selected
    else if (algorithm.value === "selection") {

        algorithmTitle.textContent = "Selection Sort";

        algorithmDescription.textContent =
            "Finds the smallest value and places it at the correct position.";
    }

    // insertion sort selected
    else if (algorithm.value === "insertion") {

        algorithmTitle.textContent = "Insertion Sort";

        algorithmDescription.textContent =
            "Takes one value at a time and inserts it into its correct position.";
    }
});


// get current speed
function getSpeed() {
    return 1100 - Number(speed.value);
}


// update two bars
function updateBars(bar1, bar2) {

    // update first bar height
    bar1.style.height = numbers[
        [...barsContainer.children].indexOf(bar1)
    ] + "%";

    // update second bar height
    bar2.style.height = numbers[
        [...barsContainer.children].indexOf(bar2)
    ] + "%";

    // update first number
    bar1.querySelector("span").textContent =
        numbers[[...barsContainer.children].indexOf(bar1)];

    // update second number
    bar2.querySelector("span").textContent =
        numbers[[...barsContainer.children].indexOf(bar2)];
}


// highlight two bars
async function compareBars(bar1, bar2) {

    bar1.classList.add("comparing");
    bar2.classList.add("comparing");

    // wait for a moment
    await wait(getSpeed());
}


// remove highlight
function removeHighlight(bar1, bar2) {

    bar1.classList.remove("comparing");
    bar2.classList.remove("comparing");
}


// ==========================
// bubble sort
// ==========================

async function bubbleSort() {

    for (let i = 0; i < numbers.length - 1; i++) {

        for (let j = 0; j < numbers.length - 1 - i; j++) {

            comparisonCount++;
            comparisons.textContent = comparisonCount;

            // get two bars
            let bar1 = barsContainer.children[j];
            let bar2 = barsContainer.children[j + 1];

            // highlight bars
            await compareBars(bar1, bar2);

            // check if swap is needed
            if (numbers[j] > numbers[j + 1]) {

                let temp = numbers[j];

                numbers[j] = numbers[j + 1];
                numbers[j + 1] = temp;

                swapCount++;
                swaps.textContent = swapCount;

                // update bars
                updateBars(bar1, bar2);

                // wait after swap
                await wait(getSpeed());
            }

            // remove highlight
            removeHighlight(bar1, bar2);
        }
    }
}


// ==========================
// selection sort
// ==========================

async function selectionSort() {

    for (let i = 0; i < numbers.length - 1; i++) {

        // assume current position has smallest number
        let minIndex = i;

        for (let j = i + 1; j < numbers.length; j++) {

            comparisonCount++;
            comparisons.textContent = comparisonCount;

            // get two bars
            let bar1 = barsContainer.children[minIndex];
            let bar2 = barsContainer.children[j];

            // highlight bars
            await compareBars(bar1, bar2);

            // find smaller number
            if (numbers[j] < numbers[minIndex]) {

                minIndex = j;
            }

            // remove highlight
            removeHighlight(bar1, bar2);
        }

        // swap if needed
        if (minIndex !== i) {

            let bar1 = barsContainer.children[i];
            let bar2 = barsContainer.children[minIndex];

            bar1.classList.add("comparing");
            bar2.classList.add("comparing");

            await wait(getSpeed());

            let temp = numbers[i];

            numbers[i] = numbers[minIndex];
            numbers[minIndex] = temp;

            swapCount++;
            swaps.textContent = swapCount;

            // update bars
            updateBars(bar1, bar2);

            await wait(getSpeed());

            removeHighlight(bar1, bar2);
        }
    }
}


// ==========================
// insertion sort
// ==========================

async function insertionSort() {

    for (let i = 1; i < numbers.length; i++) {

        let j = i;

        while (j > 0) {

            comparisonCount++;
            comparisons.textContent = comparisonCount;

            // get two bars
            let bar1 = barsContainer.children[j - 1];
            let bar2 = barsContainer.children[j];

            // highlight bars
            await compareBars(bar1, bar2);

            // check if swap is needed
            if (numbers[j - 1] > numbers[j]) {

                let temp = numbers[j - 1];

                numbers[j - 1] = numbers[j];
                numbers[j] = temp;

                swapCount++;
                swaps.textContent = swapCount;

                // update bars
                updateBars(bar1, bar2);

                await wait(getSpeed());

                removeHighlight(bar1, bar2);

                j--;
            }

            else {

                // remove highlight
                removeHighlight(bar1, bar2);

                break;
            }
        }
    }
}


// ==========================
// start sorting
// ==========================

startBtn.addEventListener("click", async function () {

    // don't start twice
    if (isSorting) return;

    // check if numbers exist
    if (numbers.length === 0) {

        status.textContent = "Generate numbers first!";

        return;
    }

    isSorting = true;

    // reset stats
    resetStats();

    status.textContent = "Sorting...";

    // disable buttons while sorting
    startBtn.disabled = true;
    randomBtn.disabled = true;
    customBtn.disabled = true;
    algorithm.disabled = true;

    // remove old sorted state
    for (let bar of barsContainer.children) {

        bar.classList.remove("sorted");
    }


    // choose selected algorithm
    if (algorithm.value === "bubble") {

        await bubbleSort();
    }

    else if (algorithm.value === "selection") {

        await selectionSort();
    }

    else if (algorithm.value === "insertion") {

        await insertionSort();
    }


    // sorting complete
    status.textContent = "Sorted!";


    // make all bars green
    for (let bar of barsContainer.children) {

        bar.classList.add("sorted");
    }


    console.log("Sorted:", numbers);
    console.log("Comparisons:", comparisonCount);
    console.log("Swaps:", swapCount);


    // allow buttons again
    isSorting = false;

    startBtn.disabled = false;
    randomBtn.disabled = false;
    customBtn.disabled = false;
    algorithm.disabled = false;
});


// ==========================
// reset
// ==========================

resetBtn.addEventListener("click", function () {

    // stop new sorting
    isSorting = false;

    // clear numbers
    numbers = [];

    // clear bars
    barsContainer.innerHTML = "";

    // reset stats
    resetStats();

    // reset status
    status.textContent = "Ready";

    // enable buttons
    startBtn.disabled = false;
    randomBtn.disabled = false;
    customBtn.disabled = false;
    algorithm.disabled = false;

    console.log("Reset");
});