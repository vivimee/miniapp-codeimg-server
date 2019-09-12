const request = require('request');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const expired = (timestamp) => {
    const time = new Date(parseInt(timestamp));
    const now = new Date().getTime();
    return now - time >= 1000 * 60 * 60 * 2;
}

const checkAndRemoveExpiredFiles = () => {
    const root = './imgs';
    const dirs = fs.readdirSync(root);
    dirs.forEach((dir) => {
        const dirpath = path.join(root, dir);
        const stat = fs.statSync(dirpath);
        if (!/\./.test(dir) && stat.isDirectory && expired(dir.replace('/', ''))) {
            spawn('rm', ['-rf', dirpath]);
        }
    });
};
setInterval(() => {
    checkAndRemoveExpiredFiles();
}, 1000 * 60 * 10);

const getAccessToken = (appid, appSecrect) => new Promise((resolve, reject) => {
    request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appSecrect}`, (error, res, body) => {
        if (error) reject(error);
        if (body.errcode) reject(body);
        resolve(JSON.parse(body).access_token);
    });
});

 const getQRCodeImg = (token, path, filename) => new Promise((resolve, reject) => {
    const options = {
        url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token}`,
        method: 'POST',
        body: JSON.stringify({ path }),
    };

    request(options).pipe(fs.createWriteStream(filename)).on('finish', () => {
        resolve(filename);
    });
});

module.exports = async (options) => {
    const { appid, appsecret, path, queryKey, queryParams, inputToken } = options;
    const token = inputToken || await getAccessToken(appid, appsecret);
    const miniappPagePath = path + '?' + queryKey + '=';
    const params = queryParams.split('\n').map(key => key.trim()).filter(Boolean);
    const childDir = `${new Date().getTime()}`;
    const dir = `./imgs/${childDir}/`;
    fs.mkdirSync(dir);
    const promisees = params.map((param) => getQRCodeImg(token, miniappPagePath + param, dir + `${param}.jpg`));
    const files = await Promise.all(promisees);
    const zippath = dir + 'bundle.zip';
    const output = fs.createWriteStream(zippath);
    const zipArchiver = archiver('zip');
    zipArchiver.pipe(output);
    files.forEach((file) => {
        zipArchiver.append(fs.createReadStream(file), { name: file.replace(dir, './bundle/') });
    });
    zipArchiver.finalize();

    return { bundleurl: zippath.replace('./imgs', '') };
}

