"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// We need to centralize the zIndex definitions as they work
// like global values in the browser.
var zIndex = {
  mobileStepper: 900,
  menu: 1000,
  appBar: 1100,
  drawerOverlay: 1200,
  navDrawer: 1300,
  dialogOverlay: 1400,
  dialog: 1500,
  layer: 2000,
  popover: 2100,
  snackbar: 2900,
  tooltip: 3000
};

exports.default = zIndex;