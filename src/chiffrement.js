const crypto = require('crypto'),
    resizedIV = Buffer.allocUnsafe(16)

const firstKey = 'CeciEstMonPremierProgrammeDeCryptogragphie'

const iv = crypto.createHash("sha256").update('MyHashedIV').digest();
iv.copy(resizedIV);

function chiffrer(chaine) {
    const key = crypto
        .createHash("sha256")
        .update(firstKey)
        .digest(),
        cipher = crypto.createCipheriv("aes256", key, resizedIV)

    var msg = "";

    msg += cipher.update(chaine, "binary", "hex") + cipher.final('hex');

    // msg += cipher.final("hex");

    return msg;
}

function dechiffrer(chaine) {
    const key = crypto
        .createHash("sha256")
        .update(firstKey)
        .digest(),
        decipher = crypto.createDecipheriv("aes256", key, resizedIV)

    var msg = "";

    msg += decipher.update(chaine, "hex", "binary") + decipher.final("binary");

    console.log(msg);

    return msg;
}

module.exports = {
    chiffrer,
    dechiffrer
}