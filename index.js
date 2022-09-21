const express  = require("express");
const cors=require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application } = require("express");
require('dotenv').config();
const port=process.env.PORT||5000;

const app=express();

//midleware

app.use(cors());
app.use(express.json());

//dbname:
//passowrd:7Pe9v2fqGy74hm4L

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcvnypp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
               await client.connect();
               const marketplaceCollection= client.db('my-project').collection('marketplace');

               //data load
               app.get('/marketplace',async(req,res)=>{
                const query={};
                const cursor=marketplaceCollection.find(query);
                const marketplaces=await  cursor.toArray();
                res.send(marketplaces);
               });

               app.get('/marketplace/:id',async(req,res)=>{
                const id=req.params.id;
                const query={_id: ObjectId(id)};
                const marketplace =await marketplaceCollection.findOne(query);
                res.send(marketplace);
               });

               app.post('/marketplace',async(req,res)=>{
                const newMarket=req.body;
                const result=await marketplaceCollection.insertOne(newMarket);
                res.send(result);
               });
           //delete
           app.delete('/marketplace/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};

             const result =await marketplaceCollection.deleteOne(query);
             res.send(result);
           })

          
    }
    finally{

    }

}

run().catch(console.dir);




//root api

app.get('/',(req,res)=>{
  res.send(' My project Server');
}
);








//for running the port

app.listen(port,()=>{
    console.log('Listening on port',port);
})