const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const _fs = Promise.promisifyAll(require('fs'));

flatten = (lists) => {
    return lists.reduce((a, b) => a.concat(b), []);
};

getDirectories =  (srcpath) => {
    return fs.readdirSync(srcpath)
        .map(file => path.resolve(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
};

getFiles = async (dir) => {
    return _fs.readdirAsync(dir).filter(function (file) {
        file = path.resolve(dir, file);
        return _fs.statAsync(file).then(function (stat) {
            if (stat.isDirectory()) {
            } else {
                return file;
            }
        })
    }).then(function (results) {
        return Array.prototype.concat.apply([], results);
    });
};


getDirectoriesRecursive = (srcpath) => {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
};

getBaseName = (srcpath, cursor) => {
    if (cursor)
        return path.basename(path.resolve(srcpath, cursor));
    return path.basename(path.resolve(srcpath));
};

createDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

addWatermark = async ({sourceImage, watermarkImage, targetFile}) => {
    try {
        await sharp(sourceImage)
            .withoutEnlargement(true)
            .overlayWith(watermarkImage, {gravity: sharp.gravity.centre})
            .toFile(targetFile);
        return true;
    } catch (e) {
        throw e;
    }
};

module.exports = async (rootDir, overlay) =>{
    try {
        const dirs = await getDirectoriesRecursive(rootDir);
        let objs = [];
        for(dir of dirs){
            let files = await getFiles(dir);
            files = files.map(_f => path.resolve(dir, _f));
            objs.push({
                dir, files
            })
        }

        const parentDir = path.resolve(rootDir, '..');
        const resultDirName = parentDir + "/" + getBaseName(rootDir) + "-watermark";
        createDir(resultDirName);
        for (obj of objs) {
            const dirName = resultDirName + "/" + getBaseName(obj.dir);
            createDir(dirName);
            obj.files.map(async file => {
                await addWatermark(
                    {
                        sourceImage: file,
                        watermarkImage: overlay,
                        targetFile: dirName+"/"+getBaseName(file)
                    }
                );
            })
        }

        return {
            message: "watermarking success"
        };
    }catch (e) {
        throw e;
    }
};
