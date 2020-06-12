const express = require('express')
const router = express.Router()
const Gaarde = require('../models/gaarde.model')


// Søgning 
router.get('/soeg/:soegord' , async(req , res) => {

    const soegord = req.params.soegord; //søgeord = "sol"

    try {
        const soeggaarde = await gaarde.find({

            $or: [
                {"name": {"$regex" : soegord, "$options": "i" } }, //søg i alt som små bogstaver
                {"gaarden": {"$regex" : soegord, "$options": "i" } } //søg i alt som små bogstaver
            ]

        })

res.json(soeggaarde); // Send søgeresultatet som response til klienten / brugeren

    } catch (error) {
        return res.status(500).json({ message: "Problemer:" + error.message})
    }


});

// Getting all
router.get('/', async (req, res) => {
    try {
        const gaardes = await Gaarde.find()
        res.json(gaardes)
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getGaarde, (req, res) => {
    res.json(res.gaarde)
})

// Creating One
router.post('/admin', async (req, res) => {
    const gaarde = new Gaarde({
        name: req.body.name,
        gaarden: req.body.gaarden
    }) 
    try {
        const newGaarde = await gaarde.save()
        res.status(201).json(newGaarde)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/admin/:id', getGaarde, async (req, res) => {
    if (req.body.name != null ) {
        res.gaarde.name = req.body.name
    }
    if (req.body.gaarden != null ) {
        res.gaarde.gaarden = req.body.gaarden
    }
    try {
        const updatedGaarde = await res.gaarde.save()
        res.json(updatedGaarde)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Deleting One
router.delete('/admin/:id', getGaarde, async (req, res) => {
    try {
        await res.gaarde.remove()
        res.json({ message: 'Deleted Gaarde'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

async function getGaarde(req, res, next) {
    let gaarde
    try{
        gaarde= await Gaarde.findById(req.params.id)
        if ( gaarde == null) {
            return res.status(404).json({ message: 'Cannot find gaarde' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.gaarde = gaarde
    next()
}

module.exports = router