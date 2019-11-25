
let url = "http://localhost:3000";

let div_list;
let form_show_btn_add_list;
let form_add_list;
let name_add_list = document.getElementById('name_add_list');
let addlist_name;
let addlist_txtResult;
let taskForm;
let cancelButton;
let formButton = document.getElementById("makeTaskID");
let deleteUserForm;
let deleteUser;
let confirmDelete;
let cancelDelete; 

window.addEventListener("load", setupBoard);

function setupBoard() {
    div_list = document.getElementById("lists");
    form_show_btn_add_list = document.getElementById("form_show_btn_add_list");
    form_add_list = document.getElementById("form_add_list");
    form_add_btn_add_list = document.getElementById("form_add_btn_add_list");
    form_close_btn_add_list = document.getElementById("form_close_btn_add_list");
    addlist_name = this.document.getElementById("name_add_list");
    addlist_txtResult = this.document.getElementById("txtResult_add_list");
    formButton = document.getElementById("makeTaskID");
    deleteUserForm = document.getElementById("deleteUserForm");
    deleteUser = document.getElementById("deleteUser");
    confirmDelete = document.getElementById("confirmDelete");
    cancelDelete = document.getElementById("cancelDelete");

    deleteUser.addEventListener("click", deleteUserWindow);
    cancelDelete.addEventListener("click", cancelResponse);
    form_show_btn_add_list.addEventListener('click', show_form_add_list);
    form_close_btn_add_list.addEventListener('click', show_form_add_list); 
    form_add_btn_add_list.addEventListener('click', add_list);

    name_add_list.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("form_add_btn_add_list").click();
        }
        if (event.keyCode === 27) {
            event.preventDefault();
            document.getElementById("form_close_btn_add_list").click();
        }
    });

    get_list();

}

async function get_list() {
    div_list.innerHTML = "";

    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;
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

            let taskButtonID = "taskButton-" + valueList.id + "-";
            let newTaskID = "newTask-" + valueList.id + "-";
            let taskMenuID = "taskMenu-" + valueList.id + "-";
            let taskNameID = "taskName-" + valueList.id + "-";
            let deleteTaskID = "deleteTask-" + valueList.id + "-";
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

            let div = document.createElement("div");
            div.id = valueList.id;
            div.className = "list";
            div.innerHTML = html + htmlTask;
            div_list.appendChild(div);
            confirmDelete.addEventListener("click", function(){
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
                delete_list(valueList.id);
            })


            editName.addEventListener("click", function () {
                console.log(editName);
                editName.style.color = "none";
                editName.style.background = "#ffffff";
            })

            let makeTask = document.getElementById(makeTaskID);
            makeTask.addEventListener("click", function () {
                taskForm.style.display = "block";
                makeTask.style.display = "none";
                taskInputName.select();

            })

            let taskForm = document.getElementById(formID);
            taskForm.addEventListener("click", function () {
            })

            let taskInputName = document.getElementById(taskInputID);
            let addTask = document.getElementById(addTaskID)
            addTask.addEventListener("click", function () {
                add_task(taskInputName.value, valueList.id);
            })

            let cancelButton = document.getElementById(cancelButtonID)
            cancelButton.addEventListener("click", function () {
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

            taskInputName.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    add_task(taskInputName.value, valueList.id);
                }
                if (event.keyCode === 27) {
                    event.preventDefault();
                    taskForm.style.display = "none";
                    makeTask.style.display = "block";
                }
            });

            editName.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    // Trigger the button element with a click
                    editName.style.color = "none";
                    editName.style.background = "none";
                    editName.blur();
                    change_name_list(valueList.id, editName.value);
                }
                if (event.keyCode === 27) {
                    event.preventDefault();
                    editName.style.color = "none";
                    editName.style.background = "none";
                    editName.blur();
                }
            });

            if (idTaskInc != 1) {
                for (let i = 1; i < idTaskInc; i++) {
                    let taskButtonIDinc = taskButtonID+i;
                    let newTaskIDinc = newTaskID + i;
                    let taskMenuIDinc = taskMenuID + i;
                    let taskNameIDinc = taskNameID + i;
                    let deleteTaskIDinc = deleteTaskID + i;

                    let taskButton = document.getElementById(taskButtonIDinc)
                    taskButton.addEventListener("click", function () {
                    })

                    let taskName = document.getElementById(taskNameIDinc)
                    taskName.addEventListener("click", function () {
                        console.log("Editing Tasks Name");
                        taskName.style.color = "black";
                        taskName.style.background = "#ffffff";
                        taskName.style.borderRadius = "5px";
                    })

                    document.addEventListener("click", function(){
                        if (event.target != taskName) {
                            taskName.style.background = "white";
                            taskName.style.color = "black";
                        } if (event.target != taskButton && taskButton.checked == true) {
                            document.getElementById(taskButtonIDinc).checked = false;
                        }
                    })

                    let deleteTask = document.getElementById(deleteTaskIDinc);
                    deleteTask.addEventListener("click", function () {
                        delete_task(taskIdArray[i-1]);
                    })

                    taskName.addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            // Trigger the button element with a click
                            taskName.style.color = "black";
                            taskName.style.background = "white";
                            taskName.blur();
                            change_name_task(taskIdArray[i-1],taskName.value);
                        }
                        if (event.keyCode === 27) {
                            event.preventDefault();
                            // Trigger the button element with a click
                            taskName.style.color = "black";
                            taskName.style.background = "white";
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
    let urlList = url + "/list"
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

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
        errorReason = "Name already in use or empty";
        addlist_txtResult.innerHTML = errorReason;
        console.log(err);
    }
}

async function delete_list(idValue) {
    let urlList = url + "/list"
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;
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
        errorReason = "Name already in use or empty";
        addlist_txtResult.innerHTML = errorReason;
        console.log(err);
    }
}

async function add_task(nameValue, listidValue) {
    let urlList = url + "/list/task"
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

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
            get_list();
        }
    }
    catch (err) {
        errorReason = "Could not add task";
        console.log(errorReason);
    }
}

async function delete_task(idValue) {
    let urltask = url + "/list/task";
    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;
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
            get_list();
        }
    }
    catch (err) {
        errorReason = "Could not delete task";
        console.log(errorReason);
    }
}

async function delete_user(idValue){ 
        let urlUser = url + "/user";
        let logindata = JSON.parse(sessionStorage.getItem("user"));
    
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
                sessionStorage.removeItem("user");
                window.location.href = "index.html";
            }
        }
        catch (err) {
            errorReason = "Could not delete task";
            console.log(errorReason);
        }
}

async function switch_public(idValue, publicValue) {
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
        errorReason = "Could not change public state";
        console.log(err);
    }
}

async function change_name_list(idValue, nameValue) {
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
        errorReason = "Could not change name";
        console.log(err);
    }
}

async function change_name_task(idValue, nameValue) {
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

function deleteUserWindow() {
    if (deleteUserForm.style.maxHeight == "0px") {
        deleteUserForm.style.maxHeight = "300px";
    } else {
        deleteUserForm.style.maxHeight = "0px";
    }
}

function cancelResponse() {
    if (event.target == cancelDelete) {
        deleteUserForm.style.maxHeight = "0px";
    }
}