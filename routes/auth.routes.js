const express = require("express");
const router = express.Router();
const Bruger = require("../models/bruger.model");

//LOGIN --------

// router.use(express.json())


router.post('/login', async (req, res) => {

  const { email, password} = req.body;

  const bruger = await Bruger.findOne({email: email})


  if (!bruger) {
    return res.status(401).json({message: "email findes ikke"});
  }

  bruger.comparePassword(password, function(err, isMatch) {
    console.log(bruger);
    if (err) {
      throw err;
    }

    
    if (isMatch){

      req.session.userId = bruger._id
      res.status(200).json({ brugernavn: bruger.brugernavn })

    } else {
      res.status(401).json({ message: "Du blev ikke login - brugernavn eller password passer ikke"})
    }

  })
  
})


//LOGOUT --------

router.get('/logout', async (req, res) => {

  req.session.destroy(err => {
     if(err) return res.status(500).json({ message: 'Logud lykkes ikke'})

      res.clearCookie(process.env.SESSION_NAME).status(200).json({message: 'Cookie er slettet'})

  })

})




//LOGGET IND --------

router.get('/loggedin', async (req, res) => {

  if (req.session.userId) {
    return res.status(200).json({message: 'Login er stadig aktiv'})

  } else {
    return res.status(401).json({ message: 'Login eksister ikke mere'})
  }

})






module.exports = router;