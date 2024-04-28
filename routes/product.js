const express = require('express')

const router = express.Router();
const Product = require('../models/product')
const multer = require('multer');
const categorie = require('../models/categorie');

filename = '';
//fonction telecharger dans serveur 
const mystorage = multer.diskStorage({
    destination :'./uploads',
    filename : (req,file,redirect)=>{
        let name = file.originalname;
        let fl = name
        redirect (null , fl);
        filename = file.mimetype;
    }
});
//n7ot taswira fi serveur y3ni bd
const upload = multer({storage : mystorage})


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products)
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json("Failed to get products");
    }
});

router.post('/createProd',upload.any('image'),async (req,res)=>{
    try{
        data = req.body;
        prd = new Product(data);
        prd.Image = filename;
        
        savedUser =await prd.save();
        
        res.send(savedUser);
    }catch(error){
        res.send(error)
    }
})


router.get('/getwithcategorie/:idcat', async (req, res) => {
    try {
        const idcat = req.params.idcat;
        
    
        const produit = await Product.find({categorie:idcat});
        if (!produit) {
            return res.status(404).send("categorie not found");
        }

        res.send(produit);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post('/recherche', async (req, res) => {
    const termeRecherche = req.body.terme;
  
    try {
      
      const produitsTrouves = await Product.find({
        $or: [
          { name: { $regex: termeRecherche, $options: 'i' } }, 
          { description: { $regex: termeRecherche, $options: 'i' } } 
        ]
      });
  
     
      res.json(produitsTrouves);
    } catch (err) {
      console.error('Erreur lors de la recherche de produits', err);
      res.status(500).json({ message: 'Une erreur est survenue lors de la recherche de produits' });
    }
  });

module.exports = router;