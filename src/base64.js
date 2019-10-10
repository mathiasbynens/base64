/*! https://mths.be/base64 v<%= version %> by @mathias | MIT license */
(function(root) {

  // Detect free variables `exports`.
  const freeExports = typeof exports == 'object' && exports;

  // Detect free variable `module`.
  const freeModule = typeof module == 'object' && module &&
    module.exports == freeExports && module;

  // Detect free variable `global`, from Node.js or Browserified code, and use
  // it as `root`.
  const freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  const InvalidCharacterError = function(message) {
    this.message = message;
  };
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  const error = function(message) {
    // Note: the error messages used throughout this file match those used by
    // the native `atob`/`btoa` implementation in Chromium.
    throw new InvalidCharacterError(message);
  };

  const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // http://whatwg.org/html/common-microsyntaxes.html#space-character
  const REGEX_SPACE_CHARACTERS = /<%= spaceCharacters %>/g;

  // `decode` is designed to be fully compatible with `atob` as described in the
  // HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
  // The optimized base64-decoding algorithm used is based on @atk’s excellent
  // implementation. https://gist.github.com/atk/1020396
  const decode = (input) => {
    const mutableInputCopy = String(input)
      .replace(REGEX_SPACE_CHARACTERS, '');
    const length = mutableInputCopy.length;
    if (length % 4 == 0) {
      mutableInputCopy = mutableInputCopy.replace(/==?$/, '');
      length = mutableInputCopy.length;
    }
    if (
      length % 4 == 1 ||
      // http://whatwg.org/C#alphanumeric-ascii-characters
      /[^+a-zA-Z0-9/]/.test(mutableInputCopy)
    ) {
      error(
        'Invalid character: the string to be decoded is not correctly encoded.'
      );
    }
    let bitCounter = 0;
    let bitStorage;
    let buffer;
    let outputArray = [];
    let position = -1;
    while (++position < length) {
      buffer = TABLE.indexOf(mutableInputCopy.charAt(position));
      bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
      // Unless this is the first of a group of 4 characters…
      if (bitCounter++ % 4) {
        // …convert the first 8 bits to a single ASCII character.
        outputArray.push(String.fromCharCode(
          0xFF & bitStorage >> (-2 * bitCounter & 6)
        ));
      }
    }
    return outputArray.join('');
  };

  // `encode` is designed to be fully compatible with `btoa` as described in the
  // HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
  const encode = (input) => {
    input = String(input);
    if (/[^\0-\xFF]/.test(input)) {
      // Note: no need to special-case astral symbols here, as surrogates are
      // matched, and the input is supposed to only contain ASCII anyway.
      error(
        'The string to be encoded contains characters outside of the ' +
        'Latin1 range.'
      );
    }
    const padding = input.length % 3;
    const outputArray = '';
    const position = -1;
    let a;
    let b;
    let c;
    let buffer;
    // Make sure any padding is handled outside of the loop.
    const length = input.length - padding;

    while (++position < length) {
      // Read three bytes, i.e. 24 bits.
      a = input.charCodeAt(position) << 16;
      b = input.charCodeAt(++position) << 8;
      c = input.charCodeAt(++position);
      buffer = a + b + c;
      // Turn the 24 bits into four chunks of 6 bits each, and append the
      // matching character for each of them to the output.
      outputArray.push(
        TABLE.charAt(buffer >> 18 & 0x3F) +
        TABLE.charAt(buffer >> 12 & 0x3F) +
        TABLE.charAt(buffer >> 6 & 0x3F) +
        TABLE.charAt(buffer & 0x3F)
      );
    }

    if (padding == 2) {
      a = input.charCodeAt(position) << 8;
      b = input.charCodeAt(++position);
      buffer = a + b;
      outputArray.push(
        TABLE.charAt(buffer >> 10) +
        TABLE.charAt((buffer >> 4) & 0x3F) +
        TABLE.charAt((buffer << 2) & 0x3F) +
        '='
      );
    } else if (padding == 1) {
      buffer = input.charCodeAt(position);
      outputArray += (
        TABLE.charAt(buffer >> 2) +
        TABLE.charAt((buffer << 4) & 0x3F) +
        '=='
      );
    }

    return outputArray.join('');
  };

  const base64 = {
    'encode': encode,
    'decode': decode,
    'version': '<%= version %>'
  };

  // Some AMD build optimizers, like r.js, check for specific condition patterns
  // like the following:
  if (
    typeof define == 'function' &&
    typeof define.amd == 'object' &&
    define.amd
  ) {
    define(function() {
      return base64;
    });
  }	else if (freeExports && !freeExports.nodeType) {
    if (freeModule) { // in Node.js or RingoJS v0.8.0+
      freeModule.exports = base64;
    } else { // in Narwhal or RingoJS v0.7.0-
      for (let key in base64) {
        base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
      }
    }
  } else { // in Rhino or a web browser
    root.base64 = base64;
  }

}(this));
