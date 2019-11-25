window.addEventListener("load", setupLogout);

function setupLogout() {

    let logoutDom = document.getElementById("logout");
    logoutDom.addEventListener('click', logoutFunc);
}

function logoutFunc(){

    //Save user in cache
    sessionStorage.removeItem("user");

    //Move to page when logged in.
    window.location.href = "index.html";

}