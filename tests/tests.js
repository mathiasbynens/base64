const base64 = require('../base64.js');

const assert = require('assert');

describe('base64.encode', function() {
	it('should work', function() {
		assert.equal(
			base64.encode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8=',
			'All possible octets'
		);
		assert.equal(
			base64.encode('a'),
			'YQ==',
			'Two padding characters'
		);
		assert.equal(
			base64.encode('aa'),
			'YWE=',
			'One padding character'
		);
		assert.equal(
			base64.encode('aaa'),
			'YWFh',
			'No padding characters'
		);
		assert.equal(
			base64.encode('foo\0'),
			'Zm9vAA==',
			'U+0000'
		);
		assert.equal(
			base64.encode('foo\0\0'),
			'Zm9vAAA=',
			'U+0000'
		);
		// Tests from https://tools.ietf.org/html/rfc4648#section-10
		assert.equal(
			base64.encode(''),
			'',
			'empty string'
		);
		assert.equal(
			base64.encode('f'),
			'Zg=='
		);
		assert.equal(
			base64.encode('fo'),
			'Zm8='
		);
		assert.equal(
			base64.encode('foo'),
			'Zm9v'
		);
		assert.equal(
			base64.encode('foob'),
			'Zm9vYg=='
		);
		assert.equal(
			base64.encode('fooba'),
			'Zm9vYmE='
		);
		assert.equal(
			base64.encode('foobar'),
			'Zm9vYmFy'
		);
		// Tests from https://github.com/w3c/web-platform-tests/blob/master/html/webappapis/atob/base64.html
		assert.throws(
			function() {
				base64.encode('\u05E2\u05D1\u05E8\u05D9\u05EA');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.encode('\u05E2\u05D1\u05E8\u05D9\u05EA');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.encode('\xFF\xFF\xC0'),
			'///A'
		);
		assert.equal(
			base64.encode('\0'),
			'AA=='
		);
		assert.equal(
			base64.encode('\0a'),
			'AGE='
		);
		assert.equal(
			base64.encode(undefined),
			'dW5kZWZpbmVk'
		);
		assert.equal(
			base64.encode(null),
			'bnVsbA=='
		);
		assert.equal(
			base64.encode(7),
			'Nw=='
		);
		assert.equal(
			base64.encode(1.5),
			'MS41'
		);
		assert.equal(
			base64.encode(true),
			'dHJ1ZQ=='
		);
		assert.equal(
			base64.encode(false),
			'ZmFsc2U='
		);
		assert.equal(
			base64.encode(NaN),
			'TmFO'
		);
		assert.equal(
			base64.encode(-Infinity),
			'LUluZmluaXR5'
		);
		assert.equal(
			base64.encode(+Infinity),
			'SW5maW5pdHk='
		);
		assert.equal(
			base64.encode(-0),
			'MA=='
		);
		assert.equal(
			base64.encode(+0),
			'MA=='
		);
		assert.equal(
			base64.encode({ 'toString': function() { return 'foo'; } }),
			'Zm9v'
		);
		assert.throws(
			function() {
				base64.encode({ 'toString': function() { throw new RangeError(); } });
			},
			RangeError
		);
		assert.throws(
			function() {
				base64.encode('\uD800\uDC00');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.encode('\uD800\uDC00');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
	});
});

describe('base64.decode', function() {
	it('should work', function() {
		assert.equal(
			base64.decode('AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8='),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'All possible octets'
		);
		assert.equal(
			base64.decode('AAECA\t\n\f\r wQFBgcICQoLDA0ODx\t\n\f\r AREhMUFRYXGBkaGxwdHh8gIS\t\n\f\r IjJCUmJygpKissLS4vMDEyMzQ1Njc4OT\t\n\f\r o7PD0+P0BBQkNERUZHSElKS0xNT\t\n\f\r k9QUVJTVFVWV1hZWltcXV5fY\t\n\f\r GFiY2RlZmdoaWprbG\t\n\f\r 1ub3BxcnN0dXZ3eH\t\n\f\r l6e3x9fn8='),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'HTML space characters must be stripped before decoding'
		);
		assert.throws(
			function() {
				base64.decode('YQ===');
			},
			/Invalid character/,
			'Invalid character'
		);
		assert.equal(
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
		assert.equal(
			base64.decode('YQ=='),
			'a',
			'Two padding characters'
		);
		assert.equal(
			base64.decode('YWE='),
			'aa',
			'One padding character'
		);
		assert.equal(
			base64.decode('YWFh'),
			'aaa',
			'No padding characters'
		);
		assert.equal(
			base64.decode('YQ'),
			'a',
			'Discarded bits'
		);
		assert.equal(
			base64.decode('YR'),
			'a',
			'Discarded bits'
		);
		assert.equal(
			base64.decode('Zm9vIGJhciBiYXo='),
			'foo bar baz',
			'One-character padding `=`'
		);
		assert.equal(
			base64.decode('Zm9vIGJhcg=='),
			'foo bar',
			'Two-character padding `==`'
		);
		assert.equal(
			base64.decode('Zm9v'),
			'foo',
			'No padding'
		);
		assert.equal(
			base64.decode('Zm9vAA=='),
			'foo\0',
			'U+0000'
		);
		assert.equal(
			base64.decode('Zm9vAAA='),
			'foo\0\0',
			'U+0000'
		);
		// Tests from https://github.com/w3c/web-platform-tests/blob/master/html/webappapis/atob/base64.html
		assert.equal(
			base64.decode(''),
			''
		);
		assert.equal(
			base64.decode('abcd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode(' abcd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('abcd '),
			'i\xB7\x1D'
		);
		assert.throws(
			function() {
				base64.decode('abcd===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
		);
		assert.throws(
			function() {
				base64.decode(' abcd===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(' abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd=== ');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd=== ');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd ===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd ===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('ab'),
			'i'
		);
		assert.equal(
			base64.decode('abc'),
			'i\xB7'
		);
		assert.throws(
			function() {
				base64.decode('abcde');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('\uD800\uDC00');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('\uD800\uDC00');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('==');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('====');
			},
		);
		assert.equal(
			(function() {
				try {
					base64.decode('====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a==');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('ab=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('ab=='),
			'i'
		);
		assert.throws(
			function() {
				base64.decode('ab===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('ab====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('ab=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('abc='),
			'i\xB7'
		);
		assert.throws(
			function() {
				base64.decode('abc==');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError',
		);
		assert.throws(
			function() {
				base64.decode('abc===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abc====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abc=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd==');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcde=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcde==');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde==');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcde===');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde===');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcde====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcde=====');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcde=====');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('=a');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('=a');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('=a=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('=a=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a=b');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a=b');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('a=b=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('a=b=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('ab=c');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab=c');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('ab=c=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab=c=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abc=d');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc=d');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abc=d=');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abc=d=');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('ab\tcd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('ab\ncd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('ab\fcd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('ab\rcd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('ab cd'),
			'i\xB7\x1D'
		);
		assert.throws(
			function() {
				base64.decode('ab\xA0cd');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('ab\xA0cd');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('ab\t\n\f\r cd'),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode(' \t\n\f\r ab\t\n\f\r cd\t\n\f\r '),
			'i\xB7\x1D'
		);
		assert.equal(
			base64.decode('ab\t\n\f\r =\t\n\f\r =\t\n\f\r '),
			'i'
		);
		assert.throws(
			function() {
				base64.decode('A');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('A');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('/A'),
			'\xFC'
		);
		assert.equal(
			base64.decode('//A'),
			'\xFF\xF0'
		);
		assert.equal(
			base64.decode('///A'),
			'\xFF\xFF\xC0'
		);
		assert.throws(
			function() {
				base64.decode('////A');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('////A');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('/');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('/');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('A/'),
			'\x03'
		);
		assert.equal(
			base64.decode('AA/'),
			'\0\x0F'
		);
		assert.throws(
			function() {
				base64.decode('AAAA/');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('AAAA/');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode('AAA/'),
			'\0\0?'
		);
		assert.throws(
			function() {
				base64.decode('\0');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('\0');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('\0nonsense');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('\0nonsense');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode('abcd\0nonsense');
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode('abcd\0nonsense');
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode(undefined);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(undefined);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode(null),
			'\x9E\xE9e'
		);
		assert.throws(
			function() {
				base64.decode(7);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(7);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode(12),
			'\xD7'
		);
		assert.throws(
			function() {
				base64.decode(1.5);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(1.5);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode(true),
			'\xB6\xBB\x9E'
		);
		assert.throws(
			function() {
				base64.decode(false);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(false);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode(NaN),
			'5\xA3'
		);
		assert.equal(
			base64.decode(+Infinity),
			'"w\xE2\x9E+r'
		);
		assert.throws(
			function() {
				base64.decode(-Infinity);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(-Infinity);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode(+0);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(+0);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.throws(
			function() {
				base64.decode(-0);
			}
		);
		assert.equal(
			(function() {
				try {
					base64.decode(-0);
				} catch (exception) {
					return exception.name;
				}
			}()),
			'InvalidCharacterError'
		);
		assert.equal(
			base64.decode({ 'toString': function() { return 'foo'; }}),
			'~\x8A'
		);
		assert.equal(
			base64.decode({ 'toString': function() { return 'abcd'; }}),
			'i\xB7\x1D'
		);
	});
});
