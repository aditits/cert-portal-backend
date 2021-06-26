const express = require('express')
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
app.use('/certificates', express.static(__dirname + "/certificates"));

const fs = require('fs')
const url = require('url');
const certificates = []


var walk    = require('walk');
var files   = [];

// Walker options
var walker  = walk.walk('./certificates', { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    let f = root + '/' + stat.name
    f = f.replace("./", "http://localhost:8000/")
    let url = new URL(f);
    files.push(url);
    next();
});

walker.on('end', function() {

});


app.get('/api/certificate/:name', (req, res) => {
    let certificateurls = []
    files.forEach(file => {
        if(file.pathname.replace("%20", "").replace(".", "").toLowerCase().includes(req.params.name.toLowerCase())){
            
            certificateurls.push(file)
        }

    })
    return res.json({status: "ok", url: certificateurls })
})



app.get('/api/test', (req, res) => {
    return res.json({status: "ok", url: files})
})



app.listen(8000, '0.0.0.0', () => {
    console.log('listening on port 8000');
})