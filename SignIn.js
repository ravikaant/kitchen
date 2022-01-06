const ip = "http://172.20.49.115:"

function getUserInfo() {
    var Username = document.getElementById("uid").value;
    var Password = document.getElementById("pass").value;

    if (Username == "" || Username == undefined || Password == "" || Password == undefined) {
        alert("Invalid Details");
        return undefined;
    }
    return {
        Username,
        Password
    };


}

function signIn() {
    var userInfo = getUserInfo();
    if (userInfo == undefined)
        return;

    var Username = userInfo["Username"];
    var Password = userInfo["Password"];
    const url = ip + "8080/signIn";
    console.log(Username + Password);
    let fetchData = {
        method: "GET",
        headers: {
            "Username": Username,
            "Password": Password
        }
    };
    // var accessToken;
    var res = fetch(url, fetchData);
    res
        .then(x => {
            console.log(x);
            return x.json();
        })
        .then(x => {
            if (x.status) {
                console.log(x.response);
                window.localStorage.setItem('userToken', JSON.stringify(x.response));
                location.replace("Home_Page.html");
                return;
            }
            else {
                alert("Invalid Credentials")
            }
        }
        )
        .catch(err => alert("Can't Connect To Servers"));





    /* .then(x => {
        var status = x["status"];
        if (status) {
            location.replace("Home_Page.html");
            alert("Sign In Successful");
        }
        else {
            alert("Invalid Credentials! Sign In Failed!");
        }
    }) */

}