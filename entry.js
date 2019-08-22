function string_to_charcodes (str) {
	var retArray = []
	for (var i = 0; i < str.length; i++) {
		retArray.push(str.charCodeAt(i));
	}
	return retArray;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

const byond = require("./byondlink")

var link = new byond("localhost",5565)
link.send("?AAAAAAAA")

exitcond = false
function wait () {
	if (!exitcond) setTimeout(wait, 1000);
}
wait()

/*
00 83 00 0f 00 00 00 00 00 3f 41 41 41 41 41 41 41 41 00
00 83 00 0f 00 00 00 00 00 3f 41 41 41 41 41 41 41 41 00 
*/