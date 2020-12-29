const express = require('express');
const app = express();
app.use(express.json())

const cron = require('node-cron')

const connect = require('./connection/connect')
const db = require('./model/item')

function auth(req,res,next){
    console.log(req.headers);
    var authHeaders = req.headers.authorization;
    if(!authHeaders){
        var err = new Error('you are not Authenticated');
        res.setHeader('WWW_Authenticate','Basic')
        res.status(401);
        next(err)
        return;
    }
    var auth = new Buffer.from(authHeaders.split(' ')[1],'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if(user == 'Komal'&& pass=='password'){
        next()
    }
    else{
        var err = new Error('you are not Authenticated');
        res.setHeader('WWW_Authenticate','Basic')
        res.sendStatus(401);
        next(err);
    }
}
app.use(auth);

app.get('/bidList',(req,res)=>{
    db.find()
    .then((data)=>{
        res.send(data)
        console.log(data)
    })
})
app.get('/bidAmount',(req,res)=>{
    var data = db.find()
    .then((data)=>{
    var bidAmount = []
        for(var i of data){
           bidAmount.push(i.amount)
        }
        res.send(bidAmount)
    })
})

app.post('/post',(req,res)=>{
    var task= cron.schedule('20 * * * * *',function(){
        // app.post('/post',(req,res)=>{
            db.find()
            .then((data)=>{
                var newBidder = new db({
                    id:data.length+1,
                    name:req.body.name,
                    amount:req.body.amount,
                    email:req.body.email
                })
                newBidder.save()
                .then((data)=>{
                    res.send('you are registered')
                })
                .catch((err)=>{
                    res.send(err)
                })
            })
        // })
    })
    if(task > cron.schedule('20 * * * * *')){
        task.destroy(res.send('times -up '))
    }
    // task.destroy(res.send('times-up'))
})

app.get('/winner',(req,res)=>{
    db.find()
    .then((data)=>{
        var max=0
        for(var i of data){
           if(max<i.amount){
               max=i.amount
           }
        }
        console.log(max)
        for (var j of data){
            if(max==j.amount)
            res.send(j)
        }
    })
})

app.listen(8000,()=>{
    console.log('server is startetd on 8000 port number ')
})

