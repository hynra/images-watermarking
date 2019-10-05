const wm = require('../src');

(async () => {
  try {
      let dirs = await wm(__dirname +'/images');
      console.log(dirs);
  }  catch (e) {
      console.log(e);
  }
})();
