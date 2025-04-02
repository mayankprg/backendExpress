import express from "express";

const router = express.Router()

router.post('/api/signUp', signUp);
router.post('/api/login', login);



module.exports = router;
