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

getFiles = (dir) => {
    return _fs.readdirAsync(dir).filter(function (file) {
        file = path.resolve(dir, file);
        return _fs.statAsync(file).then(function (stat) {
            if (stat.isDirectory()) {
                //return getFiles(file);
            } else {
                return file;
            }
        })
    }).then(function (results) {
        // flatten the array of arrays
        return Array.prototype.concat.apply([], results);
    });
};


getDirectoriesRecursive = (srcpath) => {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
};

module.exports = async (rootDir) =>{
    try {
        const dirs = await getDirectoriesRecursive(rootDir);
        let files = [];
        for(dir of dirs){
            const _files = await getFiles(dir);
            files = [...files, ..._files];
        }
        return {
            dirs,
            files
        };
    }catch (e) {
        throw e;
    }
};
