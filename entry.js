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

var data = "?AAAAAAAA"

var bytes = [0x00,0x83]
var len = new Uint16Array([data.length + 6])
bytes.push(len[0])
zeros = [0x00,0x00,0x00,0x00,0x00]
zeros.forEach(element => {
	bytes.push(element)
})
string_to_charcodes(data).map((value) => {
	bytes.push(value)
})
bytes.push(0x00)

tosend = new Uint8Array(bytes)
console.log(buf2hex(tosend))