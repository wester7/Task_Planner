let logout;

window.onload = function () {

    logout = document.getElementById("logout");
    logout.addEventListener('click', log_out);

}

function log_out(){

    //Save user in cache
    sessionStorage.removeItem("user");

    //Move to page when logged in.
    window.location.href = "index.html";

}