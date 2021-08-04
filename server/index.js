const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxbrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000;

app.get('/',(req, res) => {
    res.send('mongodb started')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const toDoCollection = client.db("todoapp").collection("namelist");

  app.post("/addTodo" , (req,res) => {
      const namelist = req.body;
      console.log(namelist);
      toDoCollection.insertOne(namelist)
      .then( result => {
          res.send(result.insertedCount>0)
        // res.redirect('/')
      })
  })

  app.get("/namelist",(req, res) =>{
    toDoCollection.find()
    .toArray((err, namelist) => {
        res.send(namelist)
    })
  })

  app.get('/singleList/:id',(req,res)=>{
    toDoCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  
  app.delete('/delete/:id',(req,res)=> {
    const id = ObjectId(req.params.id)
    toDoCollection.deleteOne({_id: id})
    .then(document =>{
      res.send(document.deletedCount>0)
    })
  })

  app.patch('/update/:id', (req, res) => {
    toDoCollection.updateOne({_id: ObjectId(req.params.id)},
        {
          $set:{name:req.body.name,email:req.body.email}
        }
    ).then(result => {
        res.send(result.modifiedCount > 0)
    })
})
  

});


app.listen(process.env.PORT || port)