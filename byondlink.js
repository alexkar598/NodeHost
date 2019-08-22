const net = require("net")

/**
 *Sends and receives data from BYOND
 *
 * @export
 * @class byondLink
 */
class byondLink{
	/**
	 *Creates an instance of byondLink.Requires a host/ip,port and authorisation key(leave empty if key not in use)
	 * @param {*} host
	 * @param {number} port
	 * @param {string} key
	 * @param {boolean} [register_server=false]
	 * @memberof byondLink
	 */
	constructor(host,port,key = "key",register_server = false){
		this.host = host
		this.port = port
		this.key = key
		this.server = null
		this.lastError = null

		if(register_server) register_server()
	}
	/**
	 *Sends data to world/Topic()
	 *
	 * @param {string} data
	 * @memberof byondLink
	 */
	send(data){
		/**
		 * @type {net.Socket}
		 */
		let socket = net.createConnection(this.port,this.host)
		socket.addListener("error",(e) => {
			this.lastError = e.message
			return false
		})
		socket.addListener("timeout",(e) => {
			this.lastError = "Timeout"
			return false
		})
		socket.addListener("connect",(e) => {
			socket.setEncoding("hex")
			socket.write(this.topic_packet(data))
		})
		socket.addListener("data",(e) => {
			console.log(e)
		})
		socket.addListener("end",(e) => {
			console.log("end")
		})
	}
	topic_packet(data){
		let datalen = data.length + 6
		let buflen = 2 + 2 + 5 + data.length + 1
		let len = datalen.toString(16).padStart(4,"0")
		let bytes = Buffer.alloc(buflen)

		bytes[0] = 0x00
		bytes[1] = 0x83
		bytes[2] = parseInt(len.slice(0,2),16)
		bytes[3] = parseInt(len.slice(2,4),16)
		/* padding between header and data (5 bytes of 0x00)*/
		for (let y = 0; y < data.length; y++) {
			bytes[9+y] = data.charCodeAt(y) //offsets it to 9 so the padding is there
		}
		bytes[buflen] = 0x00 //last char after the string must be 0x00
		console.log(bytes)
		return bytes
	}
	register_server(){
		this.server = true;
		console.log("Registering server")
	}
}

module.exports = byondLink