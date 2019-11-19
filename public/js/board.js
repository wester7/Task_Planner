//### Global Variables
//Base url 
let url = "http://localhost:4000";

//div lists
let div_list;

//form - add list
let form_show_btn_add_list;
let form_add_list;
let form_add_btn_add_list;
let form_cancel_btn_add_list;

//add list values
let addlist_name;
let addlist_txtResult;

window.onload = function () {
    //### Variables 

    div_list =  document.getElementById("lists");

    //# Add list
    //Form 
    //let listbtn = document.getElementById("list-button");
    form_show_btn_add_list = document.getElementById("form_show_btn_add_list");
    form_add_list = document.getElementById("form_add_list");
    form_add_btn_add_list = document.getElementById("form_add_btn_add_list");
    form_cancel_btn_add_list = document.getElementById("form_cancel_btn_add_list");

    addlist_name = this.document.getElementById("name_add_list");
    addlist_txtResult = this.document.getElementById("txtResult_add_list");

    //### Eventlistners 
    //Show add list form 
    form_show_btn_add_list.addEventListener('click', show_form_add_list);
    form_cancel_btn_add_list.addEventListener('click', show_form_add_list);

    //Add add_list function to add_list button 
    form_add_btn_add_list.addEventListener('click', add_list);

    get_list();

}

async function get_list(){
    

    let logindata = JSON.parse(sessionStorage.getItem("user"));
    let token = logindata.token;

    //Get list url 
    let urlList = url + "/list";

    let cfg = {
        method: "GET",
        headers: {"authorization": token},
    };

    try {
        let resp = await fetch(urlList, cfg);
        let data = await resp.json();

        if (resp.status > 202) {
            throw data;
        }
        //console.log("Getting lists");
        //div_list.innerHTML = "";

        for (let value of data) {

            let html = `
            
            
                <p class="list-title">${value.name}</p>
    
                <!-- List Dropdown Menu -->
                <label class="list-button" for="list-button">...<input class="fake-input" id="list-button" type="checkbox" name="list-button" /><ul class="listmenu">
                    <li><a class="delete" href="#">Delete</a></li>
                    <li><a class="makePublic" href="#">Make Public</a></li>
                </ul></label>
    
                <!-- Add task to list -->
                <button id="formButton" class="new-list-item">+ Add task</button>
                <form id="form1">
                    <input class="new-task-input" type="text" name="FirstName" placeholder="Write name..." autocomplete="off" value=""><br>
                    <input class="submit" value="Add">
                    <input class="submit" id="cancelButton"  value="Cancle">
                </form> 
            `;

            let div = document.createElement("div");
            div.id = value.id;
            div.className = "list";
            div.innerHTML = html;



            div_list.appendChild(div);



        }

    }
    catch(err) {
        console.log(err);
    }
}

async function add_list(evt) {

    //Get list url 
    let urlList = url + "/list"

    //Get stored user data
    let logindata = JSON.parse(sessionStorage.getItem("list"));
    
    let token = logindata.token;

    //Data to send 
    let updata = {
        name: addlist_name.value,
        userid: logindata.userid
    }

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
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
            addlist_txtResult.innerHTML = data.msg;

            div_list.innerHTML = div_list.innerHTML + `
            
                <div class="list">
                    <p class="list-title">${addlist_name.value}</p>
        
                    <!-- List Dropdown Menu -->
                    <label class="list-button" for="list-button">...<input class="fake-input" id="list-button" type="checkbox" name="list-button" /><ul class="listmenu">
                        <li><a class="delete" href="#">Delete</a></li>
                        <li><a class="makePublic" href="#">Make Public</a></li>
                    </ul></label>
        
                    <!-- Add task to list -->
                    <button id="formButton" class="new-list-item">+ Add task</button>
                    <form id="form1">
                        <input class="new-task-input" type="text" name="FirstName" placeholder="Write name..." autocomplete="off" value=""><br>
                        <input class="submit" value="Add">
                        <input class="submit" id="cancelButton"  value="Cancle">
                    </form> 
                </div>`;

        }

    }
    catch (err) {
        // Find the error reason
        errorReason = "Can not insert list";
        addlist_txtResult.innerHTML = "Error: " + errorReason;

        console.log(err);
    }
}

function show_form_add_list(){
  
      if(event.target == form_show_btn_add_list){
        form_add_list.style.display = "block";
        form_show_btn_add_list.style.display = "none";
      }
      if (event.target == form_cancel_btn_add_list){
        form_add_list.style.display = "none";
        form_show_btn_add_list.style.display = "block";
      }


}