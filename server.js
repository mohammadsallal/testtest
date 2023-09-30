const express = require('express')
const mysql=require('mysql')
const app=express()
const bodyParser = require('body-parser')
const cors=require('cors')
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken')
const secretKey = 'Mohammad'

const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'2468',
    port:3306,
    database:'testdb10'
})
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

app.use(session({
    secret: 'mohammad',
    resave:true,
    saveUninitialized:true
}))

con.connect(function(err){
    if(err)throw err;
    console.log('Sql Connected')
})

app.post('/register' ,async(req,res)=>{
    const {username , password} =await req.body
   bcrypt.hash(password , 10, (err , hash)=>{
    if(err)throw err;
   
   
    con.query(`SELECT * FROM users where username = ?`,[username], function(err,result){
        if(err)throw err;
        console.log(result)
        if(result.length == 0){
            // const sql='INSERT INTO users (UserName , PasswordU) VALUES ( ? , ?)'

            con.query(`INSERT INTO users (username , password) VALUES ( ? , ?)`,[username,hash],function(err){
                if(err)throw err;

                // alert('user registered')
                console.log('user registered')
                // let data = JSON.stringify({
                //     message:'Success'
                // })
                res.json({
                    message:'Success'
                })
                // JSON.stringify(res.json({user:"Success"}))
                //     user:'sucsess'))
                // res.json.stringify({
                //     user:'sucsess'
                // })
            })

        }
        else{
            res.writeHead(301).end('User is already exist')
        }

    })
})
})


function checkToken(req , res , next){
    const token = req.headers.authorization;
    const realToken = token.replace('Bearer ','')
    if(!token){
        return res.status(401).send('Unauthorized')
    }
    jwt.verify(realToken , secretKey , (err , user)=>{
        if(err){
          return  res.status(403).send('forbiddin')
        }
req.user = user;
        next();
        
    })
}

app.post('/login' , (req,res)=>{
    const {username , password} =  req.body;
    const token = jwt.sign({username , password} , secretKey ,{expiresIn: '1h'} )

    res.status(200).send({username , token ,meassage:'Logging Seccessfuly'})
    con.query(`SELECT * FROM users where username = ?`,[username], function(err,result){
        if(err){
            console.error('User login error' , err);
            res.status(500).send('Error logging in');
            return;
        }

        if(result.length === 0){
            res.writeHead(401).end('Username not found');
            return;
        }
        
            bcrypt.compare(password , result[0].password ,(err , result)=>{
                
            if(err){
                console.error('Password Comparing ERROR' , err);
                res.status(500).send('Error logging in');
                return;
            }
                if(result){
                    res.status(200).send({username , token ,meassage:'Logging Seccessfuly'})
                }else{
                    res.status(401).end({message:'Invalid password'})
                }
            })
    })


})

app.get('/usersInfo',checkToken,(req,res)=>{
    con.query('select * from users',(err , rsult)=>{
        if(err)throw err;
        res.status(200).send(rsult)
    })
})

app.listen(3000,()=>{
    console.log('server start')
})


