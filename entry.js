const byond = require("./node_modules/byondlink/index")
const config = require("config")
const process = require("process")
const serverClass = require("./server_control")
const path = require("path")
const fs = require("fs")
// eslint-disable-next-line no-unused-vars
const colors = require("colors")

const rl = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "NodeHost CLI_> ",
	completer: completer
})
const internalcfg = JSON.parse((fs.readFileSync("./config/dynamic.json","")))

const bylink = new byond(config.get("server.hostname"),config.get("server.port"),config.get("httptopic.port"),null,`&provider=${config.get("server.provider")}&key=${config.get("server.authkey")}`)
const git = require("simple-git")(config.get("paths.gamedir")).silent(true)

const srvctl = new serverClass({
	link: bylink,
	git: git,
	cfg: internalcfg
})
const commands = () => {return switchCommands.concat(srvctl.listTasks())}
const switchCommands = "exit reload".split(" ")

/*var ll = new byond("158.69.120.60",4133)
ll.send("status",(e) => console.log(e))
*/
/*
link.send("AAAAAAAA",(e) => {
	console.log(e)
})*/
bylink.addListener("topic",(topic) => {
	console.log(topic)
	process.exit(-154)
})
bylink.addListener("error",(err) => {
	switch (err.code) {
	case "EADDRINUSE":
		console.error(`A server is already listening on port ${config.get("server.port")},Exiting...`)
		cleanExit(-1)
		break
	}
})


function completer(line){
	const hits = commands().filter((c) => c.startsWith(line.trim().split(" ")[0]))

	return [hits.length ? hits : commands(), line]
}

rl.prompt()

rl.on("line",async (line) => {
	rl.pause()
	switch (line.trim().split(" ")[0]) {
	case "":
		break
	case "exit":
		cleanExit()
		break
	case "reload":
		srvctl.listTasks().forEach((e) => {
			// eslint-disable-next-line no-undef
			let fullpath = path.resolve(__dirname,"server_tasks/",e+".js")
			// eslint-disable-next-line no-undef
			let configpath = path.resolve(__dirname,"node_modules/config/lib/config.js")
			require.cache[fullpath] = null
			require.cache[configpath] = null
		})
		break
	default:
		try{
			if(commands().includes(line.trim().split(" ")[0])){
				let results
				if(line.trim().split(" ")[0] == "debug"){ //debug function is a special task that should be able to bypass the queue
					results = await srvctl.forceTask(...line.trim().split(" "))
				}else{
					results = await srvctl.runTask(...line.trim().split(" "))
				}
				
				if(results.status == "ok"){ //if its ok,put it in green
					console.log(`OK: ${results.message.green}`)
				}else if(results.status == "error"){
					console.error(`ERR: ${results.message.red}`) //if there is an error,put it in red
				}else{
					console.log(`${results.status.toUpperCase()}: ${results.message.yellow}`) //its a thing,not sure what but its a thing so lets make sure to print it out in yellow
				}
				
			}else{
				console.log("Invalid Command".grey)
			}
		}catch(error){
			console.error(`Error in CLI module,taskoutput unknown: \n${error}`.red)
		}
		break
	}
	rl.prompt()
})

function cleanExit(code = 0){
	srvctl.link.stop_server()
	//srvctl.runTask("detach")
	process.exit(code)
}