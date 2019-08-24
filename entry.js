const byond = require("./node_modules/byondlink/index")
const config = require("config")
const process = require("process")
const serverClass = require("./server_control")
const rl = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "NodeHost CLI_> ",
	completer: completer
})

const srvctl = new serverClass({binary_path: config.get("server.binary"), world_path: config.get("server.world"),ddlog: config.get("server.ddlog")})

const commands = () => {return switchCommands.concat(srvctl.listTasks())}
const switchCommands = "exit".split(" ")
link = new byond(config.get("byondsrv.hostname"),config.get("byondsrv.port"),config.get("nodesrv.port"))
/*var ll = new byond("158.69.120.60",4133)
ll.send("status",(e) => console.log(e))
*/
/*
link.send("AAAAAAAA",(e) => {
	console.log(e)
})
link.addListener("topic",(topic) => {
	console.log(topic)
	process.exit(-154)
})
link.addListener("error",(err) => {
	console.log(err.message)
})*/


function completer(line){
	const hits = commands().filter((c) => c.startsWith(line.trim()))

	return [hits.length ? hits : commands(), line]
}

rl.prompt()

rl.on("line", (line) => {
	switch (line.trim()) {
	case "":
		break
	case "exit":
		cleanExit()
		break
	default:
		if(commands().includes(line.trim())){
			console.log(srvctl.runTask(line.trim()))
		}else{
			console.log("Invalid Command")
			rl.prompt()
			rl.write(line.trim())
			return
		}
		break
	}
	rl.prompt()
})

function cleanExit(){
	//link.stop_server()
	//srvctl.runTask("detach")
	process.exit(0)
}