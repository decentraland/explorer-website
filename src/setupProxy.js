module.exports = function (app) {
  app.use("/cdn/:package/:version/*", (req, res, next) => {
    const options = {
      root: `./node_modules/${req.params.package}`,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    const fileName = req.params[0];

    console.log("fileName", fileName);

    res.sendFile(fileName, options, (err) => {
      if (err) {
        next(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  });
};
