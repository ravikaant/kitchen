
let stepCount = 1;
let ingredientCount = 1;
let steps = [];
let ingredients = [];
let numberOfRecipes = 0;
let pageCount = 1;
let whatToLoad = 0;


const ip = "http://172.20.49.115:"

function showOptions() {
    let container = document.getElementById("userOptions");
    container.style.display = "flex";

    let container1 = document.getElementById("header");
    container1.style.opacity = 0;
    document.getElementById('recipeDiv').style.opacity = 0.3;
    document.getElementById('searchDiv').style.opacity = 0.3;
}


function hideOptions() {
    let container = document.getElementById("userOptions");
    container.style.display = "none";

    let container1 = document.getElementById("header");
    container1.style.opacity = 1;
    document.getElementById('recipeDiv').style.opacity = 1;
    document.getElementById('searchDiv').style.opacity = 1;
}


function showAddForm() {
    let container = document.getElementById("userOptions");
    container.style.display = "none";

    let addForm = document.getElementById("addForm");
    addForm.style.display = "flex";
}


function resetForm(compReset) {
    if (compReset == 1) {
        document.getElementById("veg").checked = false;
        document.getElementById("private").checked = false;
        document.getElementById("breakfast").checked = false;
        document.getElementById('name').value = '';
    }

    document.getElementById("ingredients").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("unit").value = "";
    if (compReset == 2) {
        return;
    }

    document.getElementById("hours").value = "";
    document.getElementById("minutes").value = "";
    document.getElementById("seconds").value = "";
    document.getElementById("instructions").value = "";
}


function getCurrIngredient() {
    let ingredient = document.getElementById("ingredients").value
    let quantity = document.getElementById("quantity").value;
    let unit = document.getElementById("unit").value;

    return {
        "ingredient_name": ingredient,
        "quantity": quantity,
        "units": unit
    }
}


function getFormData() {

    ingredients.push(getCurrIngredient());
    let hours = document.getElementById("hours").value;
    let minutes = document.getElementById("minutes").value;
    let seconds = document.getElementById("seconds").value;
    let instructions = document.getElementById("instructions").value;

    return {
        'ingredients': ingredients,
        "instructions": instructions,
        "timeForNextStep": {
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }

    };

}


function cancelAddition() {
    resetForm(1);
    document.getElementById("stepContainer").innerHTML = "Step 1";
    document.getElementById("addForm").style.display = "none";
    let container = document.getElementById("header");
    container.style.display = 'flex';
    container.style.opacity = 1;
    document.getElementById('recipeDiv').style.opacity = 1;
    document.getElementById('searchDiv').style.opacity = 1;
}


function addStep() {
    stepCount++;
    document.getElementById("stepContainer").innerHTML = "Step " + stepCount;

    steps.push(getFormData());
    ingredientCount = 1;
    document.getElementById('ingredientContainer').innerText = 'Ingredient ' + ingredientCount;
    ingredients = [];
    resetForm(0);
}


function addIngredient() {
    ingredients.push(getCurrIngredient());
    ingredientCount++;
    document.getElementById('ingredientContainer').innerText = 'Ingredient ' + ingredientCount;
    resetForm(2);
}


function submitRecipe() {
    addStep();
    let name = document.getElementById("name").value;
    let breakfast = document.getElementById("breakfast").checked;
    let veg = document.getElementById("veg").checked;
    let privat = document.getElementById("private").checked;
    let userToken = window.localStorage.getItem('userToken');
    userToken = userToken.substring(1, userToken.length - 1);
    const url = ip + "8080/addRecipie?Token=" + userToken;
    let data = {
        "name": name,
        "breakfast": breakfast,
        "veg": veg,
        "privat": privat,
        "steps": steps
    };
    steps = [];
    ingredients = [];


    let fetchData = {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data)
    };
    console.log(data);

    fetch(url, fetchData)
        .then(x => {
            console.log(x);
            resetForm(1);
            document.getElementById("stepContainer").innerHTML = "Step 1";
            document.getElementById("addForm").style.display = "none";
            let container = document.getElementById("header");
            container.style.opacity = 1;
        })
        /* .then (location.replace("Home_Page.html")) */
        .catch(err => alert("Invalid Request"));

}



function loadRecipeInNewTab(idName, recList) {
    window.open('Recipe.html');
    console.log(x);
    window.localStorage.setItem('currRecipe', JSON.stringify(x));
    let currRecipe = window.localStorage.getItem('currRecipe');
    console.log(JSON.parse(currRecipe));
}

function attachRecipes(recList) {
    console.log("called");
    console.log(recList);

    for (x of recList) {
        console.log(x);
        let recN = x.name;
        let cat = x.veg ? "Veg" : "Non-Veg";

        let rec = document.createElement('div');
        rec.className = 'recipe';
        rec.id = x.id;

        let recThumb = document.createElement('img');
        recThumb.src = 'goodfood.jpeg';
        recThumb.className = 'thumb';
        rec.appendChild(recThumb);


        let recName = document.createElement('p');
        recName.className = 'RecipeName';
        recName.innerHTML = recN;
        rec.appendChild(recName);

        let recCat = document.createElement('p');
        recCat.className = 'RecipeCat';
        recCat.innerHTML = cat;
        rec.appendChild(recCat);

        let recLike = document.createElement('img');
        recLike.src = '0.jpeg';
        recLike.id = 'likeButtonForRecipe' + numberOfRecipes;
        let temp = numberOfRecipes;
        recLike.className = 'like';
        rec.appendChild(recLike);
        recLike.addEventListener('click', (ev) => {
            ev.stopPropagation();
            console.log(recLike.parentNode.id);
            //console.log(temp);
            document.getElementById('likeButtonForRecipe' + temp).src =
                (1 - parseInt(recLike.src[recLike.src.length - 6])) + '.jpeg'

            let action = 0;
            console.log(recLike.src);
            if (recLike.src[recLike.src.length - 6] == 0) {
                action = 0;
            }
            else {
                action = 1;
            }
            upVote(recLike.parentNode.id, action)
        });

        rec.addEventListener('click', () => {
            console.log(x);
            loadRecipeInNewTab(rec.id, x);
        })
        document.getElementById('recipeList').appendChild(rec);
        numberOfRecipes++;

    }
}

function setVegParameters(parameter) {
    if (parameter == 2) {
        document.getElementById('vegChecker').checked = true;
        document.getElementById('nonVegChecker').checked = true;
    }
    else if (parameter == 1) {
        document.getElementById('vegChecker').checked = true;
    }
    else if (parameter == 0) {
        document.getElementById('nonVegCheker').checked = true;
    }
}

function addVegFilter() {
    document.getElementById('VegFilter').style.display = 'flex';
    document.getElementById('PublicFilter').style.display = 'none';
    let vegCheck = document.getElementById('vegChecker');
    vegCheck.addEventListener('change', () => {
        let parameter = loadVegFilterParameter();
        numberOfRecipes = 0;
        removeChildren();
        console.log('fetching');
        loadAllFetch(parameter);
    })

    let nonVegCheck = document.getElementById('nonVegChecker');
    nonVegCheck.addEventListener('change', () => {
        let parameter = loadVegFilterParameter();
        numberOfRecipes = 0;
        removeChildren();
        console.log('fetching')
        loadAllFetch(parameter);
    });
}





function loadRecipes() {

    completelyRemoveChildren();
    numberOfRecipes = 0;
    pageCount = 0;
    addVegFilter();
    //setVegParameters(2);
    loadAllFetch(2);
}

function loadVegFilterParameter() {
    let vegChecked = document.getElementById('vegChecker').checked;
    let nonVegChecked = document.getElementById('nonVegChecker').checked;

    let parameter = 2;

    if ((vegChecked && nonVegChecked) || (!nonVegChecked && !vegChecked)) {
        parameter = 2;
    }
    else if (nonVegChecked && !vegChecked) {
        parameter = 0;
    }
    else if (!nonVegChecked && vegChecked) {
        parameter = 1;
    }

    return parameter;
}

function loadAllRecipesWithParams() {
    loadAllFetch(parameter);
}

function loadAllFetch(parameter) {

    whatToLoad = 0;

    let userToken = window.localStorage.getItem('userToken');
    console.log(userToken);
    userToken = userToken.substring(1, userToken.length - 1);
    console.log(userToken);
    //userToken = JSON.parse(userToken);

    const url = ip + '8080/getAllRecipies?Token=' + userToken + "&preference=" + parameter + '&page=' + pageCount;

    let newHeaders = new Headers();
    newHeaders.append("Token", userToken);
    newHeaders.append("Content-Type", "application/json")

    let fetchData = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log(fetchData.headers);
    // debugger;
    console.log(fetchData);


    /* recList.push(rec);
    recList.push(rec1);
    console.log(recList);
    attachRecipes(recList); */


    let res = fetch(url, fetchData);
    res
        .then(x => x.json())



        .then(x => {
            console.log("run");
            console.log(x);
            recList = [];
            recList = x;
            attachRecipes(x);
            pageCount++;
        })
        .catch(err => alert("Can't connect to servers"))

}

function setPublicParameters(parameter) {
    if (parameter == 2) {
        document.getElementById('privateChecker').checked = true;
        document.getElementById('publicChecker').checked = true;
    }
    else if (parameter == 1) {
        document.getElementById('privateChecker').checked = true;
    }
    else if (parameter == 0) {
        document.getElementById('publicCheker').checked = true;
    }
}

function loadPublicFilterParameter() {

    let publicChecked = document.getElementById('publicChecker').checked;
    let privateChecked = document.getElementById('privateChecker').checked;

    let parameter = 2;

    if ((publicChecked && privateChecked) || (!privateChecked && !publicChecked)) {
        parameter = 2;
    }
    else if (privateChecked && !publicChecked) {
        parameter = 1;
    }
    else if (!privateChecked && publicChecked) {
        parameter = 0;
    }

    return parameter;
}



function addPublicFilter() {

    document.getElementById('VegFilter').style.display = 'none';
    document.getElementById('PublicFilter').style.display = 'flex';

    let privateCheck = document.getElementById('privateChecker');
    privateCheck.addEventListener('change', () => {

        let parameter = loadPublicFilterParameter();
        removeChildren();
        numberOfRecipes = 0;
        loadUserFetch(parameter);
    })

    let publicCheck = document.getElementById('publicChecker');
    publicCheck.addEventListener('change', () => {
        let parameter = loadPublicFilterParameter();
        numberOfRecipes = 0;
        removeChildren();
        loadUserFetch(parameter);
    });
}

function loadUserRecipes() {

    completelyRemoveChildren();
    numberOfRecipes = 0;
    addPublicFilter();
    //setPublicParameters(2);
    loadUserFetch(2);

}

function loadUserFetch(paremeter) {

    whatToLoad = 1;
    let userToken = window.localStorage.getItem('userToken');
    console.log(userToken);
    userToken = userToken.substring(1, userToken.length - 1);
    console.log(userToken);
    //userToken = JSON.parse(userToken);

    let newHeaders = new Headers();
    newHeaders.append("Token", userToken);
    newHeaders.append("Content-Type", "application/json")

    const url = ip + '8080/getUserRecipies?Privately=' + paremeter + '&Token=' + userToken + '&page=' + pageCount;

    let fetchData = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log(fetchData.headers);
    // debugger;
    console.log(fetchData);




    let res = fetch(url, fetchData);
    res
        .then(x => x.json())
        .then(x => {
            console.log(x);
            attachRecipes(x);
            pageCount++;
        })
        .catch(err => alert("Can't connect to servers"))
}

function loadUserRecipesWithParams() {
    let privateChecked = document.getElementById('privateChecker').checked;
    let publicChecked = document.getElementById('publicChecker').checked;

    let parameter = 2;

    if ((privateChecked && publicChecked) || (!privateChecked && !publicChecked)) {
        parameter = 2;
    }
    else if (privateChecked && !publicChecked) {
        parameter = 0;
    }
    else if (!privateChecked && publicChecked) {
        parameter = 1;
    }
    loadUserFetch(parameter);


}



window.addEventListener('load', function () {
    addOnclickOnOtherElements();
    //loadRecipes();
});

window.addEventListener('scroll', () => {
    if (getScrollTop() < getDocumentHeight() - window.innerHeight) {
        return;
    }
    pageCount++;
    if (whatToLoad == 0) {
        loadAllFetch(loadVegFilterParameter());
    }
    else if (whatToLoad == 1) {
        loadUserFetch(loadPublicFilterParameter());
    }
});

function getDocumentHeight() {
    const body = document.body;
    const html = document.getElementById('recipeList');

    return Math.max(body.scrollHeight, body.offsetHeight, html.scrollHeight, html.offsetHeight, html.clientHeight);
}

function getScrollTop() {
    return (window.pageYOffset != undefined) ? window.pageYOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function loadScrollData() {

    let recList = [

        {
            'name': 'Salty Water',
            'veg': 1,
        },
        {
            'name': 'Salty Water',
            'veg': 1,
        },
        {
            'name': 'Salty Water',
            'veg': 1,
        },
    ]

    attachRecipes(recList);

    /* for (let i = 0; i < 2; i++) {
        let recLike = document.createElement('img');
        recLike.src = '0.jpeg';
        recLike.className = 'like';
        document.getElementById('recipeList').appendChild(recLike);
        recLike.addEventListener('click', (ev) => {
            recLike.src = (1 - parseInt(recLike.src[recLike.src.length - 6])) + '.jpeg'

            ev.stopPropagation();
        });
    } */
}


function removeChildren() {
    pageCount = 0;
    const recList = document.getElementById('recipeList');
    while (recList.lastChild) {
        if (recList.lastChild.className != 'filter')
            recList.removeChild(recList.lastChild);
        else
            break;
    }
}

function completelyRemoveChildren() {
    pageCount = 0;

    const recList = document.getElementById('recipeList');
    while (recList.lastChild) {
        recList.removeChild(recList.lastChild);
    }
}


function addOnclickOnOtherElements() {
    document.getElementById('publicRecipes').addEventListener('click', () => {
        console.log('custom recipes loaded');
        pageCount = 0;
        removeChildren();
        numberOfRecipes = 0;
        loadRecipes();
    })

    document.getElementById('myRecipeHeader').addEventListener('click', () => {
        console.log('custom recipes loaded');
        pageCount = 0;
        removeChildren();
        numberOfRecipes = 0;
        loadUserRecipes();
    })
}

function upVote(id, action) {
    console.log(action);
    let userToken = window.localStorage.getItem('userToken');
    console.log(userToken);
    userToken = userToken.substring(1, userToken.length - 1);
    const url = ip + "8080/upvoteRecipie?id=" + id + "&Token=" + userToken + '&parity=' + action;

    let fetchData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log(fetchData.headers);
    // debugger;
    console.log(fetchData);

    let res = fetch(url, fetchData);
    res
        .then(x => x.json())
        .then(x => {
            console.log(x);
        })
        .catch(err => alert("Can't connect to servers"));
}

function downVote(id, i, recList) {
    recList[i].downvotes++;
    let userToken = window.localStorage.getItem('userToken');
    console.log(userToken);
    userToken = userToken.substring(1, userToken.length - 1);
    const url = ip + "8080/downvoteRecipie?id=" + id + "&Token=" + userToken;

    let fetchData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log(fetchData.headers);
    // debugger;
    console.log(fetchData);

    let res = fetch(url, fetchData);
    res
        .then(x => x.json())
        .then(x => {
            console.log(x);
            let parameter = loadVegFilterParameter();
            pageCount = 0;
            removeChildren();
            loadAllFetch(parameter);
        })
        .catch(err => alert("Can't connect to servers"));
}

function LogOut() {
    localStorage.removeItem("userToken");
    location.replace('SignIn.html');
}

function like(id) {
    let rec = document.getElementById(id);
    if (rec.children[2].src == 'like.jpeg') {
        rec.children[2].src == 'liked.jpeg';
    }
    else {
        rec.children[2].src = 'like.jpeg';
    }
}

function loadSearchResults() {


}

function searchTag() {
    whatToLoad = 2;

    let query = document.getElementById('searchBox').value;
    let userToken = window.localStorage.getItem('userToken');
    userToken = userToken.substring(1, userToken.length - 1);
    const url = ip + `8080/searchRecipie?Token=` + userToken + `&keyword=` + query;
    let fetchData = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    console.log('fetching results');

    let res = fetch(url, fetchData);
    res
        .then(x => x.json())
        .then(x => {
            pageCount = 0;
            completelyRemoveChildren();
            attachRecipes(x);
        })
        .catch(err => alert('Can\'t Connect to servers'));

}


