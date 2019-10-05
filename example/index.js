const wm = require('../src');

(async () => {
  try {
      let result = await wm({
          rootDir: __dirname +'/images',
          overlay: __dirname +'/overlay.png',
          gravity: 'southwest'
      });
      /*
      gravity:
      north, northeast, east, southeast, south, southwest, west, northwest, center
       */
      console.log(result);
  }  catch (e) {
      console.log(e);
  }
})();
