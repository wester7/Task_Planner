//Base url 
let url = "http://localhost:3000";

window.onload = function () {
    //### Variables 

    //Login 
    let username_login = document.getElementById("username_login");
    let password_login = document.getElementById("password_login");

    let btnLogin = document.getElementById("btnLogin");
    let txtResult_login = document.getElementById("txtResult_login");

    // Create user
    let email_register = document.getElementById("email_register");
    let username_register = document.getElementById("username_register");
    let password_register = document.getElementById("password_register");
    let confirm_password_register = document.getElementById("confirm-password_register");

    let btnCreate = document.getElementById("btnCreate");
    let txtResult_register = document.getElementById("txtResult_register");

    //### Eventlistners 
    //Add register function to create button
    btnCreate.addEventListener('click', register_users);

    //Add login function to login button
    btnLogin.addEventListener('click', login_user);

}

//Functions

//Register user 
async function register_users(evt) {
        console.log("noe");
        let urlUsers = url + "/users"

        let updata = {
            email: email_register.value,
            password: password_register.value,
            username: username_register.value,
        }

        let cfg = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updata)
        }

        try {
            let resp = await fetch(urlUsers, cfg);
            let data = await resp.json();

            if (resp.status == 200) {
                txtResult_register.innerHTML = data.msg;
            }
            else {
                throw data;
            }

        }
        catch (err) {
            // Find the error reason
            errorReason = "Invalid input, check requirements.";
            txtResult_register.innerHTML = errorReason;

            console.log(err);
        }
}

//Login
async function login_user(evt) {
    if (password_login.value == "" && username_login.value == "") {
        txtResult_login.innerHTML = "Please insert login information";
    } else {
    let urlAuth = url + "/auth";

    let updata = {
        username: username_login.value,
        password: password_login.value,
    }

    let cfg = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(urlAuth, cfg);
        let data = await resp.json();
        if (resp.status > 202) {
            throw (data);
        };
        //console.log(data);
        //Text to show you are logged in.
        //txtResult_login.innerHTML = data.email + " is logged in!";

        //Save user in cache
        sessionStorage.setItem("user", JSON.stringify(data));

        //Move to page when logged in.
        window.location.href = "board.html?" + data.userid;
    }
    catch (err) {
        errorReason = "Invalid Login.";
        txtResult_login.innerHTML = errorReason;
        console.log(err);
    }
}
}
