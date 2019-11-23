//Server 
const express = require('express');
const port = process.env.PORT || 3000; // Port for server to run on. 
const app = express(); //server-app

//Secrets, tokens, encryption
const secret = "hamburgerstastegood!"; // for tokens - should be stored as an environment variable
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); //when the clients aren't on the server

//Database 
const pg = require('pg');
const dbURI = "postgres://fwyazbdyciujfb:a28b1df9d7ec85018523b4bf04b5266cbd08d4223f77bc0190422e779080b50e@ec2-54-246-84-100.eu-west-1.compute.amazonaws.com:5432/datocsnhk03b1u" + "?ssl=true";

const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({ connectionString: connstring });

let logindata;

// middleware ------------------------------------
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('public')); //for serving client files


//Rest Api On server
//Get - /list - Get lists
app.get('/list', async function (req, res) {

   let sql = "SELECT * FROM list WHERE userid = $1";
   let values = [logindata.userid];

   try {
       let result = await pool.query(sql,values);
       res.status(200).json(result.rows); //send response 
   }
   catch(err) {
       res.status(500).json(err); //send response
   }


});

//Get - /list/shared - Get shared lists
app.get('/list/shared', async function (req, res) {

   let sql = "SELECT * FROM list WHERE public = $1";
   let values = [true];

   try {
       let result = await pool.query(sql,values);
       res.status(200).json(result.rows); //send response 
   }
   catch(err) {
       res.status(500).json(err); //send response
   }


});

//Get - /list - Get tasks
app.get('/list/task', async function (req, res) {

   
   try {
      let listid = req.query.listid;
      console.log(listid);

      let sql = "SELECT * FROM task WHERE listid = $1";
      let values = [listid];


      let result = await pool.query(sql,values);

      res.status(200).json(result.rows); //send response 
   }
   catch(err) {
       res.status(500).json(err); //send response
   }


});

//Post - /list - Add list
app.post('/list', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'INSERT INTO list (id, name, userid, public) values(DEFAULT, $1, $2, $3) RETURNING *';

   let values = [updata.name, updata.userid, true];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      
      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Insert OK" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//delete - /list- delete list
app.delete('/list', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'DELETE FROM list WHERE id=$1';

   let values = [updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      console.log(result);
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Post - /list/task - Add task
app.post('/list/task', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'INSERT INTO task (id, name, listid) values(DEFAULT, $1, $2) RETURNING *';

   let values = [updata.name, updata.listid];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      
      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Insert OK" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//delete - /list/task - delete task
app.delete('/list/task', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'DELETE FROM task WHERE id=$1';

   let values = [updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      console.log(result);
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Put - /list/public - set public 
app.put('/list/public', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'UPDATE list SET public = $1 WHERE id = $2';

   let values = [updata.public, updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed public state" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Failed to change public state" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Put - /list/public - set public 
app.put('/list/name', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'UPDATE list SET name = $1 WHERE id = $2';

   let values = [updata.name, updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed name" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Failed to change name" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Put - /list/public - set public 
app.put('/list/task/name', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'UPDATE task SET name = $1 WHERE id = $2';

   let values = [updata.name, updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed name" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Failed to change name" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Post - /auth - Authenticate the user
app.post('/auth', async function (req, res) {

   let updata = req.body; //the data sent from the client

   //get the user form the database
   let sql = 'SELECT * FROM users WHERE username = $1';
   //the recived user email.
   let values = [updata.username];

   try {
      let result = await pool.query(sql, values);

      if (result.rows.length == 0) {
         res.status(400).json({ msg: "User doesn't exist" });
      }
      else {
         let check = bcrypt.compareSync(updata.password, result.rows[0].pswhash);
         if (check == true) {
            let payload = { userid: result.rows[0].id };
            let tok = jwt.sign(payload, secret, { expiresIn: "12h" }); //create token

            logindata = { email: result.rows[0].email, userid: result.rows[0].id, token: tok };

            res.status(200).json(logindata);
         }
         else {
            res.status(400).json({ msg: "Wrong password" });
         }
      }
   }
   catch (err) {
      console.log(err);
      res.status(500).json({ error: err }); //send error response
   }
});


// Post - /users - Make a user 
app.post('/users', async function (req, res) {

   let updata = req.body; // the data sent from the client

   //hashing the password before it its stored in the db
   let hash = bcrypt.hashSync(updata.password, 10);

   let sql = 'INSERT INTO users (id, email, pswhash, username) values(DEFAULT, $1, $2, $3) RETURNING *';
   let values = [updata.email, hash, updata.username];

   try {
      let result = await pool.query(sql, values);

      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Account created" }); //send response
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); //send error response
   }
});


//delete - /user - delete user
app.delete('/user', async function (req, res) {

   let updata = req.body; //the data sent from the client

   let sql = 'DELETE FROM users WHERE id=$1';

   let values = [updata.id];

   try {
      console.log(values);
      let result = await pool.query(sql, values);
      
      console.log(result);
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); //send reponse
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }

   }
   catch (err) {
      res.status(500).json({ error: err }); //sned error response

   }


});

//Get - Localhost - Get correct index page. 
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

//Get - /json - Test message 
app.get("/json", (req, res) => {
   res.json({ message: "Hello world" });
});


//Server setup  - listen to port.
app.listen(port, () => {
   console.log(`Server listening at ${port}`);
});