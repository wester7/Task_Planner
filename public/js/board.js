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
let deleteUserForm;
let deleteUser;
let confirmDelete;
let cancelDelete; 

window.addEventListener("load", setupBoard);

//---------------------------------------------------------------------------- Functions
function setupBoard() {
    //---------------------------------------------------------------------------- Variables
    div_list = document.getElementById("lists");

    //Add List Form 
    form_show_btn_add_list = document.getElementById("form_show_btn_add_list");
    form_add_list = document.getElementById("form_add_list");
    form_add_btn_add_list = document.getElementById("form_add_btn_add_list");
    form_close_btn_add_list = document.getElementById("form_close_btn_add_list");
    addlist_name = this.document.getElementById("name_add_list");
    addlist_txtResult = this.document.getElementById("txtResult_add_list");


    formButton = document.getElementById("makeTaskID");

    // Delete User Form
    deleteUserForm = document.getElementById("deleteUserForm");
    deleteUser = document.getElementById("deleteUser");
    confirmDelete = document.getElementById("confirmDelete");
    cancelDelete = document.getElementById("cancelDelete");

    //---------------------------------------------------------------------------- Eventlistners
    //Delete User Button
    deleteUser.addEventListener("click", deleteUserWindow);
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

    //Clear the field for all list 
    div_list.innerHTML = "";

    //get the login data
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

    //Get list url 
    let urlList = url + "/list";
    let urlTask = url + "/list/task";

    let cfg = {
        method: "GET",
        headers: {
            "authorization": token
        },
    };

    try {
        let respList = await fetch(urlList, cfg);
        let dataList = await respList.json();

        if (respList.status > 202) {
            throw dataList;
        }

        //console.log("Getting lists");
        //div_list.innerHTML = "";

        let idInc = 1
        for (let valueList of dataList) {
            
            let dropDownID = "list-button-" + idInc;
            let editID = "editName-" + idInc;
            let publicID = "makePublic-" + idInc;
            let deleteID = "deleteList-" + idInc;
            let makeTaskID = "makeTask-" + idInc;
            let formID = "taskForm-" + idInc;
            let cancelButtonID = "cancelButton-" + idInc;
            let addTaskID = "addTask-" + idInc;
            let taskInputID = "taskInput-" + idInc;

            let idTaskInc = 1;

            //Tasks names setup: [nameOnTheThing]-[List ID]-[TASK INCREMENTED NUMBER]
            let taskButtonID = "taskButton-" + valueList.id + "-";
            let newTaskID = "newTask-" + valueList.id + "-";
            let taskMenuID = "taskMenu-" + valueList.id + "-";
            let taskNameID = "taskName-" + valueList.id + "-";
            let deleteTaskID = "deleteTask-" + valueList.id + "-";

            //Used to add eventlistners
            let taskIdArray = [];

            let publicText = "";
            let textLabelMakePublic = "Make Public";
            let textLabelMakePrivate = "Make Private";
            
            if (valueList.public) {
                publicText = textLabelMakePrivate;
            }
            else {
                publicText = textLabelMakePublic;
            }


            let html = `
                <input id="${editID}"class="list-title" value="${valueList.name}"></input>
    
                <!-- List Dropdown Menu -->
                <label class="list-button" for="list-button">...<input class="fake-input" id="${dropDownID}" type="checkbox" name="list-button" />
                <ul class="listmenu">
                    <li><a id="${publicID}" class="makePublic">${publicText}</a></li>
                    <li><a id="${deleteID}" class="delete">Delete</a></li>
                </ul></label>
    
                <!-- Add task to list -->
                <button id="${makeTaskID}" class="new-list-item">+ Add task</button>
                <div id="${formID}">
                    <input id="${taskInputID}" type="text" name="FirstName" placeholder="Write name..." autocomplete="off" value=""><br>
                    <input class="submit" id="${addTaskID}" value="Add">
                    <input class="submit" id="${cancelButtonID}"  value="Cancel">
                </div> 

            `;

            let htmlTask = "";

            try {

                let listExt = "?listid=" + valueList.id;
                //console.log(urlTask + listExt);
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

                    <input id="${taskNameIDinc}" class="input-result" value="${valueTask.name}"></input>
                    <label class="task-button">...<input class="fake-input" id="${taskButtonIDinc}" type="checkbox" name="task-button"/> 
                    <ul id="${taskMenuIDinc}">
                    <li><a id="${deleteTaskIDinc}" class="delete">Delete</a></li>
                    </ul>
                    </label>

                    </div>`;

                    taskIdArray.push(valueTask.id);

                    idTaskInc++;

                }

            } catch (error) {
                console.log("Error with task");
            }

            console.log("taskINC:" + idTaskInc);

            let div = document.createElement("div");
            div.id = valueList.id;
            div.className = "list";
            div.innerHTML = html + htmlTask;

            

            div_list.appendChild(div);

            
            confirmDelete.addEventListener("click", function(){
                //console.log(logindata.userid);
                delete_user(logindata.userid)
            });

            let editName = document.getElementById(editID);
            let ddID = document.getElementById(dropDownID);
            document.addEventListener("click", function () {
                if (event.target != ddID && ddID.checked == true) {
                    document.getElementById(dropDownID).checked = false;
                } if (event.target != editName) {
                    editName.style.background = "none";
                } 
            });

            let deleteList = document.getElementById(deleteID);
            deleteList.addEventListener("click", function () {
                //console.log(deleteList)
                delete_list(valueList.id);
            })


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
                taskInputName.select();

            })

            let taskForm = document.getElementById(formID);
            taskForm.addEventListener("click", function () {
                console.log(taskForm);
            })

            let taskInputName = document.getElementById(taskInputID);

            let addTask = document.getElementById(addTaskID)
            addTask.addEventListener("click", function () {


                //console.log("Added task" + taskInputName.value);

                add_task(taskInputName.value, valueList.id);
            })

            let cancelButton = document.getElementById(cancelButtonID)
            cancelButton.addEventListener("click", function () {
                console.log("Cancel task making");
                taskForm.style.display = "none";
                makeTask.style.display = "block";
                taskInputName.value = "";
            })

            let makePublic = document.getElementById(publicID);
            makePublic.addEventListener("click", function () {
                if (makePublic.innerHTML == textLabelMakePublic) {
                    switch_public(valueList.id, true);
                    makePublic.innerHTML = textLabelMakePrivate;

                    return;
                } else {
                    switch_public(valueList.id, false);
                    makePublic.innerHTML = textLabelMakePublic;

                }
            });

            // Execute a function when the user releases a key on the keyboard
            taskInputName.addEventListener("keyup", function (event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    add_task(taskInputName.value, valueList.id);
                }
                if (event.keyCode === 27) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    taskForm.style.display = "none";
                    makeTask.style.display = "block";
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

                    change_name_list(valueList.id, editName.value);
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
            if (idTaskInc != 1) {
                for (let i = 1; i < idTaskInc; i++) {
                    let taskButtonIDinc = taskButtonID+i;
                    let newTaskIDinc = newTaskID + i;
                    let taskMenuIDinc = taskMenuID + i;
                    let taskNameIDinc = taskNameID + i;
                    let deleteTaskIDinc = deleteTaskID + i;

                    let taskButton = document.getElementById(taskButtonIDinc)
                    taskButton.addEventListener("click", function () {
                        console.log("task Dropdown List");
                    })

                    let taskName = document.getElementById(taskNameIDinc)
                    taskName.addEventListener("click", function () {
                        console.log("Editing Tasks Name");
                        taskName.style.color = "#747474";
                        taskName.style.background = "#ffffff";
                        taskName.style.borderRadius = "5px";
                    })

                    document.addEventListener("click", function(){
                        if (event.target != taskName) {
                            taskName.style.background = "none";
                            taskName.style.color = "#ffffff";
                        } if (event.target != taskButton && taskButton.checked == true) {
                            document.getElementById(taskButtonIDinc).checked = false;
                        }
                    })


                    let deleteTask = document.getElementById(deleteTaskIDinc);
                    deleteTask.addEventListener("click", function () {
                        console.log("deleteTask");
                        delete_task(taskIdArray[i-1]);
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

                            change_name_task(taskIdArray[i-1],taskName.value);
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
                }
            }

            
            idInc++;

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
        userid: logindata.userid,
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

async function delete_list(idValue) {

    //Get list url 
    let urlList = url + "/list"

    //Get stored user data
    let logindata = JSON.parse(sessionStorage.getItem("user"));

    let token = logindata.token;

    //Data to send 
    let updata = {
        id: idValue,
    }

    let cfg = {
        method: "Delete",
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
    }
    catch (err) {
        // Find the error reason
        errorReason = "Name already in use or empty";
        addlist_txtResult.innerHTML = errorReason;

        console.log(err);
    }
}

async function add_task(nameValue, listidValue) {

    //Get list url 
    let urlList = url + "/list/task"

    //Get stored user data
    let logindata = JSON.parse(sessionStorage.getItem("user"));

    let token = logindata.token;

    //Data to send 
    let updata = {
        name: nameValue,
        listid: listidValue,
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
            //get 
            get_list();
        }
    }
    catch (err) {
        // Find the error reason
        errorReason = "Could not add task";

        console.log(errorReason);
    }
}

async function delete_task(idValue) {

    //Get list url 
    let urltask = url + "/list/task";


    //Get stored user data
    let logindata = JSON.parse(sessionStorage.getItem("user"));

    let token = logindata.token;

    //Data to send 
    let updata = {
        id: idValue,
    }

    let cfg = {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updata)
    }

    try {
        let resp = await fetch(urltask, cfg);
        let data = await resp.json();

        if (resp.status > 202) {
            throw data;
        }
        else {
            //get 
            get_list();
        }
    }
    catch (err) {
        // Find the error reason
        errorReason = "Could not delete task";

        console.log(errorReason);
    }
}

async function delete_user(idValue){
        //Get list url 
        let urlUser = url + "/user";


        //Get stored user data
        let logindata = JSON.parse(sessionStorage.getItem("user"));
    
        //Data to send 
        let updata = {
            id: idValue,
        }
    
        let cfg = {
            method: "Delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updata)
        }
    
        try {
            let resp = await fetch(urlUser, cfg);
            let data = await resp.json();
    
            if (resp.status > 202) {
                throw data;
            }
            else {
                
                //Save user in cache
                sessionStorage.removeItem("user");

                //Move to page when logged in.
                window.location.href = "index.html";
                
            }
        }
        catch (err) {
            // Find the error reason
            errorReason = "Could not delete task";
    
            console.log(errorReason);
        }
}

async function switch_public(idValue, publicValue) {

    //Get list url 
    let urlList = url + "/list/public";

    let updata = {
        public: publicValue,
        id: idValue,
    }

    let cfg = {
        method: "PUT",
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

    }
    catch (err) {
        // Find the error reason
        errorReason = "Could not change public state";

        console.log(err);
    }


}

async function change_name_list(idValue, nameValue) {

    //Get list url 
    let urlList = url + "/list/name";

    let updata = {
        name: nameValue,
        id: idValue,
    }

    let cfg = {
        method: "PUT",
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

    }
    catch (err) {
        // Find the error reason
        errorReason = "Could not change name";

        console.log(err);
    }


}

async function change_name_task(idValue, nameValue) {

    //Get list url 
    let urlList = url + "/list/task/name";

    let updata = {
        name: nameValue,
        id: idValue,
    }

    let cfg = {
        method: "PUT",
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

    }
    catch (err) {
        // Find the error reason
        errorReason = "Could not change name";

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
        addlist_name.value = "";
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

//Runs when cancel button in delete user form is clicked
function cancelResponse() {
    if (event.target == cancelDelete) {
        console.log("Cancel");
        deleteUserForm.style.maxHeight = "0px";
    }
}