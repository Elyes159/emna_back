const express = require('express');
const categorie = require('../models/categorie');
const router = express.Router();

router.get('/categorie',async(req,res)=>{
    try{
        categoriee =await categorie.find()
        res.send(categoriee)
    }catch(error){
        res.send(error)
    }
});
router.post('/categories',async (req,res)=>{
    try{
        data = req.body;
       cat= new categorie(data);
        savedcategorie = cat.save()
        res.status(200).send(savedcategorie);
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router;