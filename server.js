
const express = require('express');
const port = process.env.PORT || 3000;  
const app = express(); 
const secret = "hamburgerstastegood!";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); 
const pg = require('pg');

let classified;
try {
   classified = require("./classified")
} catch (err) {
   console.error("Local is not running")
}

const connstring = process.env.DATABASE_URL || classified.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString: connstring });

let logindata;

app.use(cors()); 
app.use(express.json()); 
app.use('/', express.static('public')); 

app.get('/list', async function (req, res) {
   let sql = "SELECT * FROM list WHERE userid = $1";
   let values = [logindata.userid];

   try {
       let result = await pool.query(sql,values);
       res.status(200).json(result.rows); 
   }
   catch(err) {
       res.status(500).json(err); 
   }
});

app.get('/list/shared', async function (req, res) {
   let sql = "SELECT * FROM list WHERE public = $1";
   let values = [true];

   try {
       let result = await pool.query(sql,values);
       res.status(200).json(result.rows);  
   }
   catch(err) {
       res.status(500).json(err); 
   }
});

app.get('/list/task', async function (req, res) {

   try {
      let listid = req.query.listid;
      let sql = "SELECT * FROM task WHERE listid = $1";
      let values = [listid];
      let result = await pool.query(sql,values);
      res.status(200).json(result.rows); 
   }
   catch(err) {
       res.status(500).json(err);
   }
});

app.post('/list', async function (req, res) {
   let updata = req.body; 
   let sql = 'INSERT INTO list (id, name, userid, public) values(DEFAULT, $1, $2, $3) RETURNING *';
   let publicStartValue = false;
   let values = [updata.name, updata.userid, publicStartValue];

   try {
      let result = await pool.query(sql, values);
      
      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Insert OK" }); 
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.delete('/list', async function (req, res) {
   let updata = req.body; 
   let sql = 'DELETE FROM list WHERE id=$1';
   let values = [updata.id];

   try {
      let result = await pool.query(sql, values);
      
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); 
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.post('/list/task', async function (req, res) {
   let updata = req.body;
   let sql = 'INSERT INTO task (id, name, listid) values(DEFAULT, $1, $2) RETURNING *';
   let values = [updata.name, updata.listid];

   try {
      let result = await pool.query(sql, values);
      
      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Insert OK" }); 
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.delete('/list/task', async function (req, res) {
   let updata = req.body;
   let sql = 'DELETE FROM task WHERE id=$1';
   let values = [updata.id];

   try {
      let result = await pool.query(sql, values);
   
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); 
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err });
   }
});

app.put('/list/public', async function (req, res) {
   let updata = req.body;
   let sql = 'UPDATE list SET public = $1 WHERE id = $2';
   let values = [updata.public, updata.id];

   try {
      let result = await pool.query(sql, values);
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed public state" }); 
      }
      else {
         res.status(500).json({ msg: "Failed to change public state" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.put('/list/name', async function (req, res) {
   let updata = req.body; 
   let sql = 'UPDATE list SET name = $1 WHERE id = $2';
   let values = [updata.name, updata.id];
   try {
      let result = await pool.query(sql, values); 
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed name" }); 
      }
      else {
         res.status(500).json({ msg: "Failed to change name" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.put('/list/task/name', async function (req, res) {
   let updata = req.body; 
   let sql = 'UPDATE task SET name = $1 WHERE id = $2';
   let values = [updata.name, updata.id];
   try {
      let result = await pool.query(sql, values);
      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Changed name" }); 
      }
      else {
         res.status(500).json({ msg: "Failed to change name" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.post('/auth', async function (req, res) {
   let updata = req.body; 
   let sql = 'SELECT * FROM users WHERE username = $1';
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
            let tok = jwt.sign(payload, secret, { expiresIn: "12h" });
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
      res.status(500).json({ error: err }); 
   }
});

app.post('/users', async function (req, res) {
   let updata = req.body; 
   let hash = bcrypt.hashSync(updata.password, 10);
   let sql = 'INSERT INTO users (id, email, pswhash, username) values(DEFAULT, $1, $2, $3) RETURNING *';
   let values = [updata.email, hash, updata.username];
   try {
      let result = await pool.query(sql, values);

      if (result.rows.length > 0) {
         res.status(200).json({ msg: "Account created" }); 
      }
      else {
         res.status(500).json({ msg: "Insert Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.delete('/user', async function (req, res) {
   let updata = req.body; 
   let sql = 'DELETE FROM users WHERE id=$1';
   let values = [updata.id];
   try {
      let result = await pool.query(sql, values);

      if (result.rowCount > 0) {
         res.status(200).json({ msg: "Delete OK" }); 
      }
      else {
         res.status(500).json({ msg: "Delete Fail" });
      }
   }
   catch (err) {
      res.status(500).json({ error: err }); 
   }
});

app.listen(port, () => {
   console.log(`Server listening at ${port}`);
});