const spawn = require("child_process").spawn
function run(control,runMode = "safe"){
	let args = [control.world_path]
	switch (runMode) {
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
	control.gameserver = spawn(control.binary_path,args,{
			detached: true,
			stdio: ["ignore","ignore","ignore"]
	}).on("error",() => {
		return "Unable to start dreamdaemon. Verify binary path."
	})
	control.gameserver.unref()
	return "Dreamdaemon is being started."
}

module.exports = run