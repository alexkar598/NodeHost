import { toASCII } from "punycode";

const net = require("net")

/**
 *Sends and receives data from BYOND
 *
 * @export
 * @class byondLink
 */
export default class byondLink{
	/**
	 *Creates an instance of byondLink.Requires a host/ip,port and authorisation key(leave empty if key not in use)
	 * @param {*} host
	 * @param {number} port
	 * @param {string} key
	 * @param {boolean} [register_server=false]
	 * @memberof byondLink
	 */
	constructor(host,port,key = "key",register_server = false){
		super()

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
			var bytes = [0x00,0x83]
			var len = new Uint16Array(length(data) + 6).
			bytes.push(len)
			bytes.push([0x00,0x00,0x00,0x00,0x00])
			bytes.push(toASCII(data))
			bytes.push(0x00)

			tosend = new Uint8Array(bytes)
			console.log(tosend)
		})


	}
	register_server(){
		this.server = true;
		console.log("Registering server")
	}
}