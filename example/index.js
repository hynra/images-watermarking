const wm = require('../src');

(async () => {
  try {
      let result = await wm(__dirname +'/images', __dirname +'/overlay.png');
      console.log(result);
  }  catch (e) {
      console.log(e);
  }
})();
