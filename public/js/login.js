
let url = "http://localhost:3000";

window.addEventListener("load", setupLogin);

function setupLogin() {
    let username_login = document.getElementById("username_login");
    let password_login = document.getElementById("password_login");

    let btnLogin = document.getElementById("btnLogin");
    let txtResult_login = document.getElementById("txtResult_login");

    let email_register = document.getElementById("email_register");
    let username_register = document.getElementById("username_register");
    let password_register = document.getElementById("password_register");
    let confirm_password_register = document.getElementById("confirm-password_register");

    let btnCreate = document.getElementById("btnCreate");
    let txtResult_register = document.getElementById("txtResult_register");

    btnCreate.addEventListener('click', register_users);
    btnLogin.addEventListener('click', login_user);

}

async function register_users(evt) {
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
            errorReason = "Invalid input, check requirements.";
            txtResult_register.innerHTML = errorReason;
            console.log(err);
        }
}


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
        
        sessionStorage.setItem("user", JSON.stringify(data));
        window.location.href = "board.html";
    }
    catch (err) {
        errorReason = "Invalid Login.";
        txtResult_login.innerHTML = errorReason;
        console.log(err);
    }
}
}
