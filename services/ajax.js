const fs = require('fs');
const request = require('request');

module.exports = {
    // res.status(200).send({msg: 'success', urls});
    // res.json({data: body, code: 200, msg: 'success'});
    posts: {
        '/allimgs': ({body}, res) => {
            const uploadImgs = 'upload/imgs';
            const paths = fs.readdirSync(`./${uploadImgs}`);
            const urls = paths.map(name => `${uploadImgs}/${name}`);
            res.json({data: {urls}, code: 200, msg: 'success'});
            return body;
        },
        '/upload_file': () => {

        },
        '/upload_network_file': ({body: {url}}, res) => {
            if (!url) {
                res.status(404).send({msg: 'not found'});
                return;
            }
            const type = url.split('.').slice(-1)[0];
            const filename = `./upload/imgs/${+new Date()}.png`;
            // 这就是主方法
            request(url).pipe(fs.createWriteStream(filename))
            res.status(200).send({msg: 'success', path: filename});
        }

    }
}