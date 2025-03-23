const shortid = require('shortid');
const validator = require('validator');
const Url= require('../Model/urlModel');

//create a short url
const createShortUrl = async (req, res) => {
    const { url } = req.body;
    
    if (!url || !validator.isURL(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const shortCode = shortid.generate();
        const newUrl = new Url({ url, shortCode }); 
        await newUrl.save();
        res.status(200).json(newUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Retrieve Original Url 
const getOriginalUrl = async(req, res)=>{
    const { shortCode } = req.params;
    try{
        const url = await Url.findOne({ shortCode });
        if(!url){
            return res.status(404).json({ error: 'Short URL not found' });
        }

        url.accessCount++;
        await url.save();
        res.status(200).json(url);
    } catch(error){
        res.status(500).json({ error: error.message });
    }
};


//update urls
const updateUrl = async (req, res) => {
    const { shortCode } = req.params;
    const { url } = req.body;

    
    if (!url || !validator.isURL(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        
        const newShortCode = shortid.generate();
        const updatedUrl = await Url.findOneAndUpdate(
            { shortCode },  
            { url, shortCode: newShortCode, updatedAt: Date.now() }, 
            { new: true, runValidators: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.status(200).json(updatedUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//delete short url
const deleteUrl = async(req, res)=>{
    const { shortCode } = req.params;
    try{
        const deletedUrl = await Url.findOneAndDelete({ shortCode });
        if(!deletedUrl){
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.status(200).json({ message: 'Short URL deleted successfully' });
    } catch(error){
        res.status(500).json({ error: error.message });
    }
};

//Get Url statistics
const getUrlStats = async(req, res)=>{
    const { shortCode } = req.params;

    try {
        const urlDoc = await Url.findOne({ shortCode });
        if (!urlDoc) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.status(200).json(urlDoc);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Export all functions
module.exports = {
    createShortUrl,
    getOriginalUrl,
    updateUrl,
    deleteUrl,
    getUrlStats,
};