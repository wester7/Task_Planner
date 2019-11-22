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
let formButton = document.getElementById("makeTaskID");

// Delete User Form
let deleteUserForm = document.getElementById("deleteUserForm");
let deleteUser = document.getElementById("deleteUser");
let confirmDelete = document.getElementById("confirmDelete");
let cancelDelete = document.getElementById("cancelDelete");


//---------------------------------------------------------------------------- Functions
window.onload = function () {
    //---------------------------------------------------------------------------- Variables
    div_list = document.getElementById("lists");

    //Add List Form 
    form_show_btn_add_list = document.getElementById("form_show_btn_add_list");
    form_add_list = document.getElementById("form_add_list");
    form_add_btn_add_list = document.getElementById("form_add_btn_add_list");
    form_close_btn_add_list = document.getElementById("form_close_btn_add_list");
    addlist_name = this.document.getElementById("name_add_list");
    addlist_txtResult = this.document.getElementById("txtResult_add_list");

    //---------------------------------------------------------------------------- Eventlistners
    //Delete User Button
    deleteUser.addEventListener("click", deleteUserWindow);
    confirmDelete.addEventListener("click", deleteResponse);
    cancelDelete.addEventListener("click", cancelResponse);



    //Show add list form 
    form_show_btn_add_list.addEventListener('click', show_form_add_list);
    form_close_btn_add_list.addEventListener('click', show_form_add_list);

    //Add add_list function to add_list button 
    form_add_btn_add_list.addEventListener('click', add_list);

    // Execute a function when the user releases a key on the keyboard
    name_add_list.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("form_add_btn_add_list").click();
        }
        if (event.keyCode === 27) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("form_close_btn_add_list").click();
        }
    });

    get_list();

}



async function get_list() {

    div_list.innerHTML = "";
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

    //Get list url 
    let urlList = url + "/list";

    let cfg = {
        method: "GET",
        headers: { "authorization": token },
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

            let dropDownID = "list-button-" + idInc;
            let editID = "editName-" + idInc;
            let publicID = "makePublic-" + idInc;
            let deleteID = "deleteList-" + idInc;
            let makeTaskID = "makeTask-" + idInc;
            let formID = "taskForm-" + idInc;
            let cancelButtonID = "cancelButton-" + idInc;
            let addTaskID = "addTask-" + idInc;
            let taskInputID = "taskInput-" + idInc;
            let taskButtonID = "taskButton-" + idInc;
            let newTaskID = "newTask-" + idInc;
            let taskMenuID = "taskMenu-" + idInc;
            let taskNameID = "taskName" + idInc;
            let deleteTaskID = "deleteTask-" + idInc;


            let html = `
                <input id="${editID}"class="list-title" value="${value.name}"></input>
    
                <!-- List Dropdown Menu -->
                <label class="list-button" for="list-button">...<input class="fake-input" id="${dropDownID}" type="checkbox" name="list-button" />
                <ul class="listmenu">
                    <li><a id="${publicID}" class="makePublic">Make Public</a></li>
                    <li><a id="${deleteID}" class="delete">Delete</a></li>
                </ul></label>
    
                <!-- Add task to list -->
                <button id="${makeTaskID}" class="new-list-item">+ Add task</button>
                <div id="${formID}">
                    <input id="${taskInputID}" type="text" name="FirstName" placeholder="Write name..." autocomplete="off" value=""><br>
                    <input class="submit" id="${addTaskID}" value="Add">
                    <input class="submit" id="${cancelButtonID}"  value="Cancel">
                </div> 




                <div id="${newTaskID}" class="list-item">

                <input id="${taskNameID}" class="input-result" value="A New Task Test"></input>
                <label class="task-button">...<input class="fake-input" id="${taskButtonID}" type="checkbox" name="task-button"/> 
                <ul id="${taskMenuID}">
                    <li><a id="${deleteTaskID}" class="delete">Delete</a></li>
                </ul>
                </label>

                </div>
                


            `;

            let div = document.createElement("div");
            div.id = value.id;
            div.className = "list";
            div.innerHTML = html;

            div_list.appendChild(div);

            let ddID = document.getElementById(dropDownID);
            document.addEventListener("click", function () {
                if (event.target != ddID && ddID.checked == true) {
                    document.getElementById(dropDownID).checked = false;
                }
            });

            let deleteList = document.getElementById(deleteID);
            deleteList.addEventListener("click", function () {
                console.log(deleteList)
            })


            let editName = document.getElementById(editID);
            editName.addEventListener("click", function () {
                console.log(editName);
                editName.style.color = "#747474";
                editName.style.background = "#ffffff";
            })

            let makeTask = document.getElementById(makeTaskID);
            makeTask.addEventListener("click", function () {
                console.log(makeTask);
                taskForm.style.display = "block";
                makeTask.style.display = "none";
            })

            let taskForm = document.getElementById(formID);
            taskForm.addEventListener("click", function () {
                console.log(taskForm);
            })

            let addTask = document.getElementById(addTaskID)
            addTask.addEventListener("click", function () {
                console.log("Added task");
            })

            let cancelButton = document.getElementById(cancelButtonID)
            cancelButton.addEventListener("click", function () {
                console.log("Cancel task making");
                taskForm.style.display = "none";
                makeTask.style.display = "block";
            })

            let makePublic = document.getElementById(publicID);
            makePublic.addEventListener("click", function () {
                if (makePublic.innerHTML == "Make Public") {
                    makePublic.innerHTML = "Make Private";
                    return;
                } else {
                    makePublic.innerHTML = "Make Public";
                }
            });

            // Execute a function when the user releases a key on the keyboard
            editName.addEventListener("keyup", function (event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    editName.style.color = "#384e6e";
                    editName.style.background = "none";
                    editName.blur();
                }
                if (event.keyCode === 27) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    editName.style.color = "#384e6e";
                    editName.style.background = "none";
                    editName.blur();
                }
            });

            // A NEW TASK STUFF

            let taskButton = document.getElementById(taskButtonID)
            taskButton.addEventListener("click", function () {
                console.log("task Dropdown List");
            })

            let taskName = document.getElementById(taskNameID)
            taskName.addEventListener("click", function () {
                console.log("Editing Tasks Name");
                taskName.style.color = "#747474";
                taskName.style.background = "#ffffff";
                taskName.style.borderRadius = "5px";
            })


            let deleteTask = document.getElementById(deleteTaskID);
            deleteTask.addEventListener("click", function () {
                console.log(deleteTask)

            })


            // Execute a function when the user releases a key on the keyboard
            taskName.addEventListener("keyup", function (event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    taskName.style.color = "white";
                    taskName.style.background = "#3f807a";
                    taskName.blur();
                }
                if (event.keyCode === 27) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    taskName.style.color = "white";
                    taskName.style.background = "#3f807a";
                    taskName.blur();
                }
            });







            idInc++

        }

    }
    catch (err) {
        console.log(err);
    }
}

async function add_list() {

    //Get list url 
    let urlList = url + "/list"

    //Get stored user data
    let logindata = JSON.parse(sessionStorage.getItem("user"));

    let token = logindata.token;

    //Data to send 
    let updata = {
        name: addlist_name.value,
        userid: logindata.userid
    }

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(urlList, cfg);
        let data = await resp.json();

        if (resp.status > 202) {
            throw data;
        }
        else {

            get_list();

        }

        addlist_name.value = "";

    }
    catch (err) {
        // Find the error reason
        errorReason = "Name already in use or empty";
        addlist_txtResult.innerHTML = errorReason;

        console.log(err);
    }
}

function show_form_add_list() {
    if (event.target == form_show_btn_add_list) {
        form_add_list.style.display = "block";
        form_show_btn_add_list.style.display = "none";
        newList.style.padding = "5px 20px 50px 20px";
    }
    if (event.target == form_close_btn_add_list) {
        form_add_list.style.display = "none";
        form_show_btn_add_list.style.display = "block";
        newList.style.padding = "20px";
    }
    addlist_name.select();
}

//Runs when delete user button is clicked
function deleteUserWindow() {
    console.log("Window Opened");
    if (deleteUserForm.style.maxHeight == "0px") {
        deleteUserForm.style.maxHeight = "300px";
    } else {
        deleteUserForm.style.maxHeight = "0px";
    }
}

//Runs when delete button in delete user form is clicked
function deleteResponse() {
    if (event.target == confirmDelete) {
        console.log("User Deleted");
    }
}

//Runs when cancel button in delete user form is clicked
function cancelResponse() {
    if (event.target == cancelDelete) {
        console.log("Cancel");
        deleteUserForm.style.maxHeight = "0px";
    }
}