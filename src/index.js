const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

flatten = (lists) => {
    return lists.reduce((a, b) => a.concat(b), []);
};

getDirectories = (srcpath) => {
    return fs.readdirSync(srcpath)
        .map(file => path.resolve(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
};

getDirectoriesRecursive = (srcpath) => {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
};

module.exports = async (rootDir) =>{
    try {
        const dirs = await getDirectoriesRecursive(rootDir);
        return dirs;
    }catch (e) {
        throw e;
    }
};
