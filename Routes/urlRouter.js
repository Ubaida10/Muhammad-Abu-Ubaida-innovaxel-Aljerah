const express = require('express');
const router = express.Router();
const urlController = require('../Controller/urlController');

// Routes
router.post('/shorten', urlController.createShortUrl);
router.get('/shorten/:shortCode', urlController.getOriginalUrl);
router.put('/shorten/:shortCode', urlController.updateUrl);
router.delete('/shorten/:shortCode', urlController.deleteUrl);
router.get('/shorten/shorten/:shortCode', urlController.getUrlStats);

// Export the routes
module.exports = router;