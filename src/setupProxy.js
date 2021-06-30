const { readFileSync } = require("fs");

const safeStringify = (obj, indent = 4) => {
  let cache = [];

  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );

  cache = null;

  return retVal;
};

const returnFileFromDir = (dir) => (req, res, next) => {
  const fileName = req.params[0];
  console.log(dir, safeStringify(req));

  const file = readFileSync(
    `./node_modules/decentraland-kernel/${dir}/${fileName}`
  ).toString("utf-8");

  if (file.length < 1) {
    console.log("file not found");
  } else {
    console.log("Line:", file.substr(0, 100));
  }

  const options = {
    root: `./node_modules/decentraland-kernel/${dir}`,
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  return res.status(200).sendFile(fileName, options);
};

module.exports = function (app) {
  app.use("/website.js", (req, res, next) => {
    console.log("WEBSITE", safeStringify(req));
    const website = readFileSync(
      "./node_modules/decentraland-kernel/dist/website.js"
    ).toString("utf-8");

    return res.status(200).send(website);
  });

  app.use("/0.js", (req, res, next) => {
    console.log("0.js", safeStringify(req));
    const website = readFileSync(
      "./node_modules/decentraland-kernel/dist/0.js"
    ).toString("utf-8");

    return res.status(200).send(website);
  });

  app.use("/1.js", (req, res, next) => {
    console.log("1.js", safeStringify(req));
    const website = readFileSync(
      "./node_modules/decentraland-kernel/dist/1.js"
    ).toString("utf-8");

    return res.status(200).send(website);
  });
  app.use("/2.js", (req, res, next) => {
    console.log("2.js", safeStringify(req));
    const website = readFileSync(
      "./node_modules/decentraland-kernel/dist/2.js"
    ).toString("utf-8");

    return res.status(200).send(website);
  });
  app.use("/3.js", (req, res, next) => {
    console.log("3.js", safeStringify(req));
    const website = readFileSync(
      "./node_modules/decentraland-kernel/dist/3.js"
    ).toString("utf-8");

    return res.status(200).send(website);
  });

  app.use("/default-profile/*", returnFileFromDir("default-profile"));

  app.use("/loader/*", returnFileFromDir("loader"));

  app.use("/systems/*", returnFileFromDir("systems"));

  app.use("/unity-renderer/*", returnFileFromDir("unity-renderer"));

  app.use("/voice-chat-codec/*", returnFileFromDir("voice-chat-codec"));
};
