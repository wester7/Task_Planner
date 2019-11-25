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
    let urlTask = url + "/list/task";

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

            let idTaskInc = 1;

            //Tasks names setup: [nameOnTheThing]-[List ID]-[TASK INCREMENTED NUMBER]
            let taskButtonID = "taskButton-" + value.id + "-";
            let newTaskID = "newTask-" + value.id + "-";
            let taskMenuID = "taskMenu-" + value.id + "-";
            let taskNameID = "taskName-" + value.id + "-";
            let deleteTaskID = "deleteTask-" + value.id + "-";

            let html = `
                <input id="${editID}"class="list-title" value="${value.name}" disabled></input>
            `;




            let htmlTask = "";
        
            console.log(value.id);

            try {

                let listExt = "?listid=" + value.id;
                console.log(urlTask + listExt);
                let respTask = await fetch(urlTask + listExt, cfg);
                let dataTask = await respTask.json();

                if (respTask.status > 202) {
                    throw dataTask;
                }

                for (let valueTask of dataTask) {
                    
                    let taskButtonIDinc = taskButtonID+idTaskInc;
                    let newTaskIDinc = newTaskID + idTaskInc;
                    let taskMenuIDinc = taskMenuID + idTaskInc;
                    let taskNameIDinc = taskNameID + idTaskInc;
                    let deleteTaskIDinc = deleteTaskID + idTaskInc;

                    htmlTask += `<div id="${newTaskIDinc}" class="list-item">

                    <input id="${taskNameIDinc}" class="input-result" value="${valueTask.name}" disabled> </input>

                    </div>`;

                    idTaskInc++;

                }

            } catch (error) {
                console.log("Error with task");
            }

            let div = document.createElement("div");
            div.id = value.id;
            div.className = "list";
            div.innerHTML = html + htmlTask;

            div_list.appendChild(div);

            idInc++

        }



    }
    catch (err) {
        console.log(err);
    }
}