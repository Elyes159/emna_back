
const mongoose = require('mongoose')

const categorie = mongoose.model('categorie',{
  
    Nomcategorie:{
        type : String
    },

   
    
})

module.exports = categorie;