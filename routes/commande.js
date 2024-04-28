

const express = require('express');
const  Commande = require("../models/commande");
const router = express.Router();

router.post('/createCommande',async (req,res)=>{
    try{
        data = req.body;
        cmd = new Commande(data)
        
        savedCmnd =await cmd.save();
        
        res.send(savedCmnd);
    }catch(error){
        res.send(error)
    }
})
router.delete('/delete/:id',async(req,res)=>{
    try{
        idcmd = req.params.id
        deletedCommande = await Commande.findOneAndDelete({_id : idcmd})
        res.send("Commande with this id : "+idcmd+"  is deleted !")
    }catch(error){
        res.send(error)
    }
});
router.put('/update/:id',async(req,res)=>{
    try{
        idCmd = req.params.id
        dataUpdated = req.body;
        CmdUpdated = await Commande.findOneAndUpdate({_id :idCmd},dataUpdated)
        res.send("Commande with this id : "+idCmd+"  is updated !")
    }catch(error){
        res.status(400).send(error)
    }
});
module.exports = router;


module.exports = router;
