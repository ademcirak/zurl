'use strict';

function randomChar() {
  const n = Math.floor(Math.random() * 62);

  if (n < 10) {
    return n;
  }

  if (n < 36) {
    return String.fromCharCode(n + 55); // A - Z
  }

  return String.fromCharCode(n + 61); // a - z
}

function createHash(length) {
  let string = '';

  while (string.length < length) {
    string += randomChar();
  }

  return string;
}

// Note: This module makes no guarantees of uniqueness
module.exports = createHash;

