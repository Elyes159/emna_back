const express = require('express')

const router = express.Router();

const User = require('../models/user');
const { route } = require('./product');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const Product = require('../models/product')



router.post('/create',async (req,res)=>{
    try{
        data = req.body;
        usr = new User(data);
        savedUser =await usr.save();
        res.status(200).send(savedUser);
    }catch(error){
        res.status(400).send(error)
    }
})
router.post('/register',async (req,res)=>{
    try{
        data = req.body;
        usr = new User(data);
        console.log(data);
        salt = bcrypt.genSaltSync(10);
        cryptedPass = await bcrypt.hashSync(data.password,salt)
        usr.password = cryptedPass;
        savedUser = usr.save()
        res.status(200).send(savedUser);
    }catch(error){
        res.status(400).send(error)
    }
})
router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).send('Email or password invalid!');
        }

        const validPass = bcrypt.compareSync(data.password, user.password);
        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        }

        // Génération du token
        const payload = {
            _id: user._id,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`
        };
        const token = jwt.sign(payload, '123456');

        // Mise à jour de l'attribut token de l'utilisateur dans la base de données
        user.token = token;
        await user.save();

        res.status(200).send({ mytoken: token });
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/logout', async (req, res) => {
    try {
        // Récupérer l'utilisateur en fonction du token dans la requête
        const user = await User.findOne({ token: req.body.token });

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        // Effacer le token de l'utilisateur
        user.token = undefined;
        await user.save();

        res.status(200).send('Déconnexion réussie');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la déconnexion');
    }
});

router.get('/readall',async(req,res)=>{
    try{
        users =await User.find()
        res.send(users)
    }catch(error){
        res.send(error)
    }
});

router.get('/getById/:id',async(req,res)=>{
try{
    myid = req.params.id
    user = await User.findOne({_id :myid})
    res.send(user)
}catch(error){
    res.send(error);
}
});

router.get('/getByToken/:token',async(req,res)=>{
    try{
        token = req.params.token
        user = await User.findOne({token :token})
        res.send(user)
    }catch(error){
        res.send(error);
    }
    });


router.delete('/delete/:id',async(req,res)=>{
    try{
        myid = req.params.id
        deletedUser = await User.findOneAndDelete({_id : myid})
        res.send("user with this id : "+myid+"  is deleted !")
    }catch(error){
        res.send(error)
    }
});


router.put('/update/:id',async(req,res)=>{
    try{
        myid = req.params.id
        dataUpdated = req.body;
        deletedUser = await User.findOneAndUpdate({_id : myid},dataUpdated)
        res.send("user with this id : "+myid+"  is updated !")
    }catch(error){
        res.send(error)
    }
});
router.put('/updatePass/:id', async (req, res) => {
    try {
        const myid = req.params.id;
        const { oldPassword, newPassword } = req.body;

        // Vérifier si les champs oldPassword et newPassword existent
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both oldPassword and newPassword fields are required");
        }

        
        const user = await User.findById(myid);
        if (!user) {
            return res.status(404).send("User not found");
        }

      
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect old password");
        }

       
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        user.password = hashedPassword;
        user.confirmpassword = hashedPassword;
        await user.save();

        res.send("Password for user with this id : " + myid + " is updated !");
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/updateadresse/:id', async (req, res) => {
    try {
        const myid = req.params.id;
        const { oldadresse, newadresse } = req.body;

        // Vérifier si les champs oldPassword et newPassword existent
        if (!oldadresse || !newadresse) {
            return res.status(400).send("Both oldPassword and newPassword fields are required");
        }

        
        const user = await User.findById(myid);
        if (!user) {
            return res.status(404).send("adresse not found");
        }
        user.adresse=newadresse;
        await user.save();

        res.send("adresse for user with this id : " + myid + " is updated !");
    } catch (error) {
        res.status(500).send(error);
    }
});
router.put('/add-to-favorites/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }

       
        if (user.favorites.includes(productId)) {
            return res.status(400).send("Product already exists in favorites");
        }

       
        user.favorites.push(productId);
        await user.save();

        res.send("Product added to favorites successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/add-to-cart/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        if (user.cart.includes(productId)) {
            return res.status(400).send("Product already exists in cart");
        }

        // Ajouter le produit au panier de l'utilisateur
        user.cart.push(productId);
        await user.save();

        res.send("Product added to cart successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/get-cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Récupérer les détails du panier de l'utilisateur
        const cartProducts = await Product.find({ _id: { $in: user.cart } });

        res.send(cartProducts);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/favorites/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Récupérer les détails des produits favoris de l'utilisateur
        const favoriteProducts = await Product.find({ _id: { $in: user.favorites } });

        res.send(favoriteProducts);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/remove-from-favorites/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const productIndex = user.favorites.indexOf(productId);
        if (productIndex === -1) {
            return res.status(400).send("Product does not exist in favorites");
        }

        // Supprimer le produit des favoris de l'utilisateur
        user.favorites.splice(productIndex, 1);
        await user.save();

        res.send("Product removed from favorites successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/users/:token', async (req, res) => {
    try {
        // Récupérer l'utilisateur en fonction du token
        const user = await User.findOne({ token: req.params.token });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Envoyer l'utilisateur en réponse
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
});




module.exports = router;