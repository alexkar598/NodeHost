const spawn = require("child_process").spawn
const config = require("config")
async function run({control}){
	let args = [config.get("paths.world")]
	switch (config.get("server.security")) {
	case "trusted":
		args.push("-trusted")
		break
	case "safe":
		args.push("-safe")
		break
	case "ultrasafe":
		args.push("-ultrasafe")
		break
	default:
		break
	}
	args.push(`-port ${config.get("server.port")}`)
	args.concat(config.get("server.args").split(" "))
	let ret = new Promise((resolve,reject) => {
		let err = false
		if(control.gameserver && control.gameserver.killed === false){
			reject("The server is already running")
		}
		control.gameserver = spawn(config.get("paths.dd_binary"),args,{
			detached: true,
			stdio: ["ignore","ignore","ignore"],
		})
		control.gameserver.on("error",(e) => {
			err = true
			reject("TASKERR: Unable to start dreamdaemon: " + e)
		})
		control.gameserver.unref()
		setTimeout(() => { //there is no real way to tell if it has been started successfully so just tell yes if it hasent errored out after a second
			if(!err){
				resolve("Dreamdaemon has been started")
			}
		},1000)
	})
	return ret
}

module.exports = run