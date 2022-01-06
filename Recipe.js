function appendStep(id, step, i) {
    console.log(id);
    var stepno = document.createElement('h4');
    stepno.innerHTML = "Step " + i;
    stepno.style.color = 'rgb(248, 246, 250)'
    document.getElementById(id).appendChild(stepno);


    var ingredients = step.ingredients;
    for (ing of ingredients) {
        var ingrDiv = document.createElement('div');
        ingrDiv.style.display = 'flex';
        ingrDiv.style.flexDirection = 'row';

        var ingr = document.createElement('h4');
        ingr.innerHTML = "Ingredients : " + ing.ingredient_name + " - " + ing.quantity + " " + ing.units;
        ingr.style.color = 'rgb(248, 246, 250)'
        ingrDiv.appendChild(ingr);
        document.getElementById(id).appendChild(ingrDiv);
    }

    var stepIns = document.createElement('h4');
    stepIns.innerHTML = "Instructions : " + step.instructions;
    stepIns.style.color = 'rgb(248, 246, 250)'
    document.getElementById(id).appendChild(stepIns);

}

var min, sec;

function emptyDiv(id) {
    var targetDiv = document.getElementById(id);
    while (targetDiv.firstChild) {
        targetDiv.removeChild(targetDiv.firstChild);
    }
}

async function loadSteps(steps) {
    console.log(steps);

    document.getElementById('currentStep').style.display = 'flex';
    document.getElementById('nextStep').style.display = 'flex';
    document.getElementById('starttimer').style.display = 'block';

    for (let i = 0; i < steps.length; i++) {
        document.getElementById('starttimer').style.display = 'block';
        emptyDiv('currentStep');
        emptyDiv('nextStep');
        appendStep('currentStep', steps[i], i + 1);
        if (i + 1 < steps.length) {
            appendStep('nextStep', steps[i + 1], i + 2);
        }
        else {
            document.getElementById('nextStepIndicator').style.display = 'none';
        }
        var timerDiv = document.createElement('div');
        timerDiv.innerHTML = 'Time Left in this step : ';
        timerDiv.style.color = 'rgb(248, 246, 250)'
        timerDiv.style.display = 'flex';
        timerDiv.style.flex = 'column';


        var minuteCont = document.createElement('h4');
        minuteCont.id = 'minute';
        minuteCont.style.color = 'rgb(248, 246, 250)'
        minuteCont.innerHTML = steps[i].timeForNextStep.minutes;
        timerDiv.appendChild(minuteCont);

        var minuteSep = document.createElement('h4');
        minuteSep.innerHTML = ' : ';
        minuteSep.style.color = 'rgb(248, 246, 250)'
        timerDiv.appendChild(minuteSep);

        var secondCont = document.createElement('h4');
        secondCont.id = 'second';
        secondCont.style.color = 'rgb(248, 246, 250)'
        secondCont.innerHTML = steps[i].timeForNextStep.seconds;
        timerDiv.appendChild(secondCont);

        document.getElementById('currentStep').appendChild(timerDiv);
        callDecrease();
        console.log(sec);
        await click()
        document.getElementById('starttimer').style.display = 'none';
        await decrease();
        if (i == steps.length - 1) {
            emptyDiv('currentStep');
            alert("Successfully completed");
            break;
        }
        alert('Be Raedy for Next Step');
        console.log("Step completed successfully");
    }

    document.getElementById('currentStep').style.display = 'none';
    document.getElementById('nextStep').style.display = 'none';

    var repeat = document.createElement('button');
    repeat.innerHTML = "Start Again";
    document.getElementById('recipeList').appendChild(repeat);
    repeat.addEventListener('click', () => {
        repeat.style.display = 'none';
        loadSteps(steps);
    })
}
function callDecrease() {
    min = document.getElementById('minute').innerHTML;
    sec = parseInt(min * 60) + parseInt(document.getElementById('second').innerHTML);
    console.log(min);
    console.log(sec);
}
function click() {
    return new Promise((resolve, reject) => {
        document.getElementById("starttimer").addEventListener("click", () => {
            resolve();
        });
    })
}
async function decrease() {
    return new Promise((resolve) => {
        console.log('function called');
        if (document.getElementById) {
            const interval = setInterval(() => {
                minutes = document.getElementById('minute');
                seconds = document.getElementById('second');

                minutes.innerHTML = getminutes();
                seconds.innerHTML = getseconds();

                if (min < 0) {
                    minutes.innerHTML = 0;
                    seconds.innerHTML = 0;
                    resolve("This Step is completed");
                    clearInterval(interval);
                    console.log('after resolving');
                }
                else {
                    sec--;
                }
            }, 1000);
        }

    })
}

function gethours() {
    hr = Math.floor(min / 60);
    return hr;
}

function getminutes() {
    min = Math.floor(sec / 60);
    return min;
}

function getseconds() {
    return sec - Math.round(min * 60);
}


function loadContents() {
    console.log('Loading Contents');

    var currRecipe = window.localStorage.getItem('currRecipe');
    currRecipe = JSON.parse(currRecipe)
    console.log(currRecipe);

    var recN = document.createElement("h1");
    recN.innerHTML = currRecipe.name;
    console.log(recN);
    document.getElementById('RecipeHeader').appendChild(recN);

    var vegCat = document.createElement('h3');
    vegCat.innerHTML = currRecipe.veg ? 'Veg' : 'Non-Veg';
    console.log(vegCat);
    document.getElementById('RecipeHeader').appendChild(vegCat);

    var bfCat = document.createElement('h3');
    bfCat.innerHTML = currRecipe.breakfast ? 'BreakFast' : 'Lunch/Dinner';
    document.getElementById('RecipeHeader').appendChild(bfCat);

    loadSteps(currRecipe.steps);
}



window.onload = function () {
    loadContents();
}


