
const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, destination) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
        });

        await fs.promises.writeFile(destination, Buffer.from(response.data));

        console.log('Resim başarıyla indirildi:', destination);
    } catch (error) {
        console.error('Resim indirme hatası:', error.message);
    }
}



module.exports = downloadImage;
