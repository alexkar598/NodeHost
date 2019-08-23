const byond = require("./node_modules/byondlink/index")
const config = require("config")
const process = require("process")
const serverClass = require("./server_control")

const srvctl = new serverClass({binary_path: config.get("server.binary"), world_path: config.get("server.world"),ddlog: config.get("server.ddlog")})
srvctl.runTask("start",config.get("server.security"))
var link = new byond(config.get("byondsrv.hostname"),config.get("byondsrv.port"),config.get("nodesrv.port"))
link.send("AAAAAAAA",(e) => {
	console.log(e)
})
link.addListener("topic",(topic) => {
	console.log(topic)
	process.exit(-154)
})
link.addListener("error",(err) => {
	console.log(err.message)
})
link.stop_server()