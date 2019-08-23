const spawn = require("child_process").spawn
function start(control,runMode = "safe"){
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
	spawn(control.binary_path,args,{
		detached: true,
		stdio: ["ignore","ignore","ignore"]
	}).unref()
}

module.exports = start