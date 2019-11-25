//---------------------------------------------------------------------------- Global Variables
//Base url 
let url = "http://localhost:3000";

//div lists
let div_list;

//form - add list
let form_show_btn_add_list;
let form_add_list;
let name_add_list = document.getElementById('name_add_list');

//add list values
let addlist_name;
let addlist_txtResult;

//new task form
let taskForm;
let cancelButton;

// Delete User Form
let deleteUserForm = document.getElementById("deleteUserForm");
let deleteUser = document.getElementById("deleteUser");
let confirmDelete = document.getElementById("confirmDelete");
let cancelDelete = document.getElementById("cancelDelete");

window.addEventListener("load", setupSharedList);

//---------------------------------------------------------------------------- Functions
function setupSharedList() {
    //---------------------------------------------------------------------------- Variables
    div_list = document.getElementById("lists");

    //Add List Form 
    form_show_btn_add_list = document.getElementById("form_show_btn_add_list");
    form_add_list = document.getElementById("form_add_list");
    form_add_btn_add_list = document.getElementById("form_add_btn_add_list");
    form_close_btn_add_list = document.getElementById("form_close_btn_add_list");
    addlist_name = this.document.getElementById("name_add_list");
    addlist_txtResult = this.document.getElementById("txtResult_add_list");

    get_sharedlist();

}

async function get_sharedlist() {

    //Clear the field for all list 
    div_list.innerHTML = "";

    //get the login data
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

    //Get list url 
    let urlList = url + "/list/shared";

    let cfg = {
        method: "GET",
        headers: { 
            "authorization": token 
        },
    };

    try {
        let resp = await fetch(urlList, cfg);
        let data = await resp.json();

        if (resp.status > 202) {
            throw data;
        }
        //console.log("Getting lists");
        //div_list.innerHTML = "";

        let idInc = 1
        for (let value of data) {

            let editID = "editName-" + idInc;
            let newTaskID = "newTask-" + idInc;
            let taskNameID = "taskName" + idInc;

            let html = `
                <input id="${editID}"class="list-title" value="${value.name}" disabled></input>

                <div id="${newTaskID}" class="shared-list-item">

                <input id="${taskNameID}" class="input-result" value="A New Task Test" style="cursor:default" disabled></input>

                </div>
                


            `;

            let div = document.createElement("div");
            div.id = value.id;
            div.className = "list";
            div.innerHTML = html;

            div_list.appendChild(div);

            idInc++

        }



    }
    catch (err) {
        console.log(err);
    }
}