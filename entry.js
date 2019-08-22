/* function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  } */

const byond = require("byondlink")

var link = new byond("localhost",5565,18595)
link.send("AAAAAAAA",(e) => {
	console.log(e)
})
link.addListener("topic",(topic) => {
	console.log(topic)
})
