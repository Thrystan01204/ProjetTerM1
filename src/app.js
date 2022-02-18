const express = require('express');
const path = require('path');
const router = express.Router();

const fileupload = require('express-fileupload');

var chiffreur = require('./chiffrement');

const stream = require('stream');
const fs = require('fs');

var admZip = require('adm-zip');

const uploadDIR = path.join(__dirname, '/upload/');
const extractDIR = path.join(__dirname, '/extract/');

if (!fs.existsSync(uploadDIR)) fs.mkdirSync(uploadDIR);
if (!fs.existsSync(extractDIR)) fs.mkdir(extractDIR);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileupload());

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});

router.post('/etudiant', function (req, res) {
    res.sendFile(path.join(__dirname + '/form_etudiant.html'));
});

router.post('/professeur', function (req, res) {
    res.sendFile(path.join(__dirname + '/professeur.html'));
});

router.post('/chiffrer', function (req, res) {
    input = (req.body['nom'] + " " + req.body['prenom'] + " " + req.body['numEtudiant'] + " " + req.body['dateNaissance']).replace(" ", "_");

    var msg = chiffreur.chiffrer(input);

    console.log(msg);

    var readStream = new stream.PassThrough();

    readStream.end(msg);

    res.set('Content-disposition', 'attachment; filename=' + req.body['nom'].replace(" ", "_"));
    res.set('Content-Type', 'text/plain');

    readStream.pipe(res);
});


function browseZip(path) {
    var result = [];
    var zip = new admZip(path);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        if (zipEntry.isDirectory) {
            return;
        }

        var entryName = zipEntry.entryName;

        var content = zip.readFile(entryName);
        result.push(chiffreur.dechiffrer(content.toString('utf8')));
        console.log(result.toString());
    });

    return result;
}

function supprZip(path) {
    fs.rm(path, (err) => {
        throw err;
    })
}

router.post('/dechiffrer', function (req, res) {
    var file = req.files.toDecrypt;

    if (file.name.includes('.txt')) {
        chaine = file.data.toString('utf8');

        res.send(dechiffrer(chaine))
    } else if (file.name.includes(".zip")) {
        var zipPath = uploadDIR + file.name;
        console.log("********\n" + zipPath + "\n********");

        file.mv(zipPath, () => {
            var etudiants = browseZip(zipPath);

            res.send(etudiants.toString());
        });

        fs.unlinkSync(zipPath);
    }
})
//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
