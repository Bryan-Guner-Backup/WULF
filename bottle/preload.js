console.log("preload");
const { webFrame } = require("electron");
webFrame.registerURLSchemeAsPrivileged("b");
webFrame.registerURLSchemeAsPrivileged("c");
webFrame.registerURLSchemeAsPrivileged("file");
webFrame.registerURLSchemeAsBypassingCSP("b");
webFrame.registerURLSchemeAsBypassingCSP("c");
webFrame.registerURLSchemeAsBypassingCSP("file");
