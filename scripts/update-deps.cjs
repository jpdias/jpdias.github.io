#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var __dirname = path.dirname(require("path").resolve(__filename));
var root = path.join(__dirname, "..");

var nm = function(p) { return path.join(root, "node_modules", p); };
var dest = function(p) { return path.join(root, p); };

var copies = [
  ["litelight-js/dist/lite-light.min.js", "js/lite-light.min.js"],
  ["litelight-js/dist/lite-light.min.css", "css/lite-light.min.css"],
  ["remixicon/fonts/remixicon.woff2", "fonts/remixicon.woff2"],
  ["remixicon/fonts/remixicon.woff", "fonts/remixicon.woff"],
  ["academicons/fonts/academicons.woff", "fonts/academicons.woff"],
  ["academicons/css/academicons.css", "css/academicons.css"],
];

var ok = true;
copies.forEach(function(c) {
  var src = nm(c[0]);
  var out = dest(c[1]);
  try {
    var data = fs.readFileSync(src);
    var p = path.dirname(out);
    fs.mkdirSync(p, { recursive: true });
    fs.writeFileSync(out, data);
    console.log("Copied " + out);
  } catch(e) {
    console.error("Failed to copy " + out + ": " + e.message);
    ok = false;
  }
});

if (ok) {
  console.log("All deps updated. Commit the changed files to finish.");
} else {
  console.error("Some copies failed — check errors above.");
  process.exit(1);
}