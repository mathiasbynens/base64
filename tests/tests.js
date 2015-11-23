(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	// The `base64` object to test
	var base64 = root.base64 || (root.base64 = (
		base64 = load('../base64.js') || root.base64,
		base64 = base64.base64 || base64
	));

	/*--------------------------------------------------------------------------*/

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment
	QUnit.module('base64');

	test('base64.encode', function() {
		equal(
			base64.encode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8=',
			'All possible octets'
		);
		equal(
			base64.encode('a'),
			'YQ==',
			'Two padding characters'
		);
		equal(
			base64.encode('aa'),
			'YWE=',
			'One padding character'
		);
		equal(
			base64.encode('aaa'),
			'YWFh',
			'No padding characters'
		);
		equal(
			base64.encode('foo\0'),
			'Zm9vAA==',
			'U+0000'
		);
		equal(
			base64.encode('foo\0\0'),
			'Zm9vAAA=',
			'U+0000'
		);
		// Tests from https://github.com/w3c/web-platform-tests/blob/master/html/webappapis/atob/base64.html
		raises(
			function() {
				base64.encode('\u05E2\u05D1\u05E8\u05D9\u05EA');
			},
			'The string to be encoded contains characters outside of the Latin1 range.'
		);
		equal(
			(function() {
				try {
					base64.encode('\u05E2\u05D1\u05E8\u05D9\u05EA');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'The string to be encoded contains characters outside of the Latin1 range.'
		);
		equal(
			base64.encode('\xFF\xFF\xC0'),
			'///A'
		);
		equal(
			base64.encode('\0'),
			'AA=='
		);
		equal(
			base64.encode('\0a'),
			'AGE='
		);
		equal(
			base64.encode(undefined),
			'dW5kZWZpbmVk'
		);
		equal(
			base64.encode(null),
			'bnVsbA=='
		);
		equal(
			base64.encode(7),
			'Nw=='
		);
		equal(
			base64.encode(1.5),
			'MS41'
		);
		equal(
			base64.encode(true),
			'dHJ1ZQ=='
		);
		equal(
			base64.encode(false),
			'ZmFsc2U='
		);
		equal(
			base64.encode(NaN),
			'TmFO'
		);
		equal(
			base64.encode(-Infinity),
			'LUluZmluaXR5'
		);
		equal(
			base64.encode(+Infinity),
			'SW5maW5pdHk='
		);
		equal(
			base64.encode(-0),
			'MA=='
		);
		equal(
			base64.encode(+0),
			'MA=='
		);
		equal(
			base64.encode({ 'toString': function() { return 'foo'; } }),
			'Zm9v'
		);
		raises(
			function() {
				base64.encode({ 'toString': function() { throw new RangeError(); } });
			},
			RangeError
		);
		raises(
			function() {
				base64.encode('\uD800\uDC00');
			},
			'The string to be encoded contains characters outside of the Latin1 range.'
		);
		equal(
			(function() {
				try {
					base64.encode('\uD800\uDC00');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'The string to be encoded contains characters outside of the Latin1 range.'
		);
	});

	test('base64.decode', function() {
		equal(
			base64.decode('AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8='),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'All possible octets'
		);
		equal(
			base64.decode('AAECA\t\n\f\r wQFBgcICQoLDA0ODx\t\n\f\r AREhMUFRYXGBkaGxwdHh8gIS\t\n\f\r IjJCUmJygpKissLS4vMDEyMzQ1Njc4OT\t\n\f\r o7PD0+P0BBQkNERUZHSElKS0xNT\t\n\f\r k9QUVJTVFVWV1hZWltcXV5fY\t\n\f\r GFiY2RlZmdoaWprbG\t\n\f\r 1ub3BxcnN0dXZ3eH\t\n\f\r l6e3x9fn8='),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'HTML space characters must be stripped before decoding'
		);
		raises(
			function() {
				base64.decode('YQ===');
			},
			/Invalid character/,
			'Invalid character'
		);
		equal(
			(function() {
				try {
					base64.decode('YQ===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'The string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('YQ=='),
			'a',
			'Two padding characters'
		);
		equal(
			base64.decode('YWE='),
			'aa',
			'One padding character'
		);
		equal(
			base64.decode('YWFh'),
			'aaa',
			'No padding characters'
		);
		equal(
			base64.decode('YQ'),
			'a',
			'Discarded bits'
		);
		equal(
			base64.decode('YR'),
			'a',
			'Discarded bits'
		);
		equal(
			base64.decode('Zm9vIGJhciBiYXo='),
			'foo bar baz',
			'One-character padding `=`'
		);
		equal(
			base64.decode('Zm9vIGJhcg=='),
			'foo bar',
			'Two-character padding `==`'
		);
		equal(
			base64.decode('Zm9v'),
			'foo',
			'No padding'
		);
		equal(
			base64.decode('Zm9vAA=='),
			'foo\0',
			'U+0000'
		);
		equal(
			base64.decode('Zm9vAAA='),
			'foo\0\0',
			'U+0000'
		);
		// Tests from https://github.com/w3c/web-platform-tests/blob/master/html/webappapis/atob/base64.html
		equal(
			base64.decode(''),
			''
		);
		equal(
			base64.decode('abcd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode(' abcd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('abcd '),
			'i\xB7\x1D'
		);
		raises(
			function() {
				base64.decode('abcd===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode(' abcd===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(' abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd=== ');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd=== ');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd ===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd ===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('ab'),
			'i'
		);
		equal(
			base64.decode('abc'),
			'i\xB7'
		);
		raises(
			function() {
				base64.decode('abcde');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('\uD800\uDC00');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('\uD800\uDC00');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('==');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a==');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('ab=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('ab=='),
			'i'
		);
		raises(
			function() {
				base64.decode('ab===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('ab====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('ab=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('abc='),
			'i\xB7'
		);
		raises(
			function() {
				base64.decode('abc==');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abc===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abc====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abc=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd==');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcde=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcde==');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcde===');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcde====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcde=====');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcde=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('=a');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('=a');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('=a=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('=a=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a=b');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a=b');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('a=b=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('a=b=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('ab=c');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab=c');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('ab=c=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab=c=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abc=d');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc=d');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abc=d=');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abc=d=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('ab\tcd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('ab\ncd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('ab\fcd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('ab\rcd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('ab cd'),
			'i\xB7\x1D'
		);
		raises(
			function() {
				base64.decode('ab\xA0cd');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('ab\xA0cd');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('ab\t\n\f\r cd'),
			'i\xB7\x1D'
		);
		equal(
			base64.decode(' \t\n\f\r ab\t\n\f\r cd\t\n\f\r '),
			'i\xB7\x1D'
		);
		equal(
			base64.decode('ab\t\n\f\r =\t\n\f\r =\t\n\f\r '),
			'i'
		);
		raises(
			function() {
				base64.decode('A');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('A');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('/A'),
			'\xFC'
		);
		equal(
			base64.decode('//A'),
			'\xFF\xF0'
		);
		equal(
			base64.decode('///A'),
			'\xFF\xFF\xC0'
		);
		raises(
			function() {
				base64.decode('////A');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('////A');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('/');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('/');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('A/'),
			'\x03'
		);
		equal(
			base64.decode('AA/'),
			'\0\x0F'
		);
		raises(
			function() {
				base64.decode('AAAA/');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('AAAA/');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode('AAA/'),
			'\0\0?'
		);
		raises(
			function() {
				base64.decode('\0');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('\0');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('\0nonsense');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('\0nonsense');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode('abcd\0nonsense');
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode('abcd\0nonsense');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode(undefined);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(undefined);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode(null),
			'\x9E\xE9e'
		);
		raises(
			function() {
				base64.decode(7);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(7);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode(12),
			'\xD7'
		);
		raises(
			function() {
				base64.decode(1.5);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(1.5);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode(true),
			'\xB6\xBB\x9E'
		);
		raises(
			function() {
				base64.decode(false);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(false);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode(NaN),
			'5\xA3'
		);
		equal(
			base64.decode(+Infinity),
			'"w\xE2\x9E+r'
		);
		raises(
			function() {
				base64.decode(-Infinity);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(-Infinity);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode(+0);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(+0);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		raises(
			function() {
				base64.decode(-0);
			},
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			(function() {
				try {
					base64.decode(-0);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
			'Invalid character: the string to be decoded is not correctly encoded.'
		);
		equal(
			base64.decode({ 'toString': function() { return 'foo'; }}),
			'~\x8A'
		);
		equal(
			base64.decode({ 'toString': function() { return 'abcd'; }}),
			'i\xB7\x1D'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
