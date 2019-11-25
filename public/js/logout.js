window.addEventListener("load", setupLogout);

function setupLogout() {
    let logoutDom = document.getElementById("logout");
    logoutDom.addEventListener('click', logoutFunc);
}

function logoutFunc(){
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
}