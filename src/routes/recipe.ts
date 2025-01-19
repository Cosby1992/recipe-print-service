import express from 'express';
const router = express.Router()

// Attach middleware specific to this router here if necessary

export const recipeRouter = router.post('/print-friendly', (req, res) => {
    res.send("[POST '/'] working!");
});