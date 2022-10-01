const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const app = express();
const ngrok = require('ngrok');
const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    return response.send('Hello');
});

app.get('/upload', (request, response) => {
    return response.send('Success!');
})

app.post('/upload', (request, response) => {
    //Create an instance of the form object
    let form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(request, function (error, fields, file) {
        let filepath = file.fileupload.filepath;
        let dir = '/Users/bprakashputta/Personal/himashu_sir/images/';
        let newpath = dir + 'uploads/'
        if (!fs.existsSync(newpath)){
            fs.mkdirSync(newpath);
        }else{
            fs.rmdirSync(newpath, { recursive: true, force: true });
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            fs.mkdirSync(newpath);
        }
        newpath += file.fileupload.originalFilename;

        //Copy the uploaded file to a custom folder
        fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
        response.write('NodeJS File Upload Success!');
        response.end();
        });
    });
})

// app.listen(PORT, (err) => {
//     if (err) throw err;

//     console.log('listening on port', PORT);
// });

app.listen(PORT, (err) => {
    if (err) return console.log(`Something bad happened: ${err}`);

    console.log(`Node.js server listening on ${PORT}`);
});

ngrok.connect({
    proto : 'http',
    addr : PORT,
}, (err, url) => {
    if (err) {
        console.error('Error while connecting Ngrok',err);
        return new Error('Ngrok Failed');
    }
});