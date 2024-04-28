const express = require('express')


const productRoute = require('./routes/product')
const userRoute = require('./routes/user')
const commandeRoute = require('./routes/commande')
const categorieRoute = require('./routes/categorie')
const hostname = '192.168.1.17 ';
require('./config/connect')
const app = express()
// const cors = require('cors')

app.use(express.json());

app.use('/product',productRoute)
app.use('/user',userRoute)
app.use('/commande',commandeRoute)
app.use('/categorie',categorieRoute)

app.use('/getimage/',express.static('./uploads'))

app.listen(3003,hostname=>{
    console.log('server work')
});
