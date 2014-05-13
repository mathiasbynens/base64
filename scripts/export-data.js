var fs = require('fs');
var regenerate = require('regenerate');

// http://whatwg.org/html/common-microsyntaxes.html#space-character
var spaceCharacters = regenerate(
	0x0020, // U+0020 SPACE
	0x0009, // U+0009 CHARACTER TABULATION (tab)
	0x000A, // U+000A LINE FEED (LF)
	0x000C, // U+000C FORM FEED (FF)
	0x000D  // U+000D CARRIAGE RETURN (CR)
);

module.exports = {
	'spaceCharacters': spaceCharacters.toString(),
	'version': JSON.parse(fs.readFileSync('package.json', 'utf-8')).version
};
