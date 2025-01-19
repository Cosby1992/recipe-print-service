import express from 'express';
const router = express.Router()

// Attach middleware specific to this router here if necessary

export const recipeRouter = router.post('/extract-from-url', (req, res) => {

    // extract and validate body/dto

    // call and "verify" provided url and store html in mem

    // Send predefined prompt to chat gpt for converting the recepi to json

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions

    // return json dto with portions, ingredients, preparing steps, etc..

    res.send("[POST '/'] working!");
});