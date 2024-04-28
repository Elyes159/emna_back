
const mongoose = require('mongoose')

const Commande = mongoose.model('Commande',{
  
    iduser:{
        type : String
    },
    idproduct:{
        type : String
    },
   status:{
        type : String
    },
    totalprice:{
        type : Number
    },
   
    quantité: {
        type : String
    },
    cupons: {
        type : String
    },
   
    
})

module.exports = Commande;