//import
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1218269",
    key: "d02c55ce7a6aa58b2f1a",
    secret: "1d7fe7a55a05e2547afd",
    cluster: "ap2",
    useTLS: true
  });

  const db = mongoose.connection
  db.once('open',() => {
      console.log('DB is connected');
      const msgCollection = db.collection('messagecontents');
      const changeStream = msgCollection.watch()

      changeStream.on("change",(change) => {
          console.log(change);
          if(change.operationType==='insert'){
              const messageDetails = change.fullDocument;
              pusher.trigger('messages', 'inserted',{
                  name: messageDetails.name,
                  message: messageDetails.message,
                  timestamp : messageDetails.timestamp,
                  received : messageDetails.received
              });
          }else{
              console.log('Error tiggering pusher');
          }
      });
  });


//middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})


//DB config
const connection_url = "mongodb+srv://DocBotplus:root@cluster0.blsp2.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

//????


//api routes
app.get('/',(req,res) =>res.status(200).send('Hello World'));

app.post('/messages/new',(req,res) =>{
    const dbMessage = req.body

    Messages.create(dbMessage,(err, data) =>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

//listener
app.listen(port,()=>console.log(`listening on localhost: ${port}`));