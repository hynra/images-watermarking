const wm = require('../src');

(async () => {
  try {
      let dirs = await wm(__dirname +'/images', __dirname +'/overlay.png');
      console.log(dirs);
  }  catch (e) {
      console.log(e);
  }
})();
