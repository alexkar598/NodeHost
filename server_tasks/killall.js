const os = require("os")
const exec = require("child_process").exec

function run(){
	let ret = new Promise((resolve,reject) => {
		switch (os.platform()) {
		case "linux":
			exec("killall dreamdeamon")
				.on("exit",() => {
					resolve("All instances of dreamdaemons have been terminated")
				})
				.on("error", (e) => reject("TASKERR: Unable to terminate all instances of dreamdaemon: " + e))
			break
		case "win32":
			exec("taskkill /f /im dreamdaemon.exe")
				.on("exit",() => {
					resolve("All instances of dreamdaemons have been terminated")
				})
				.on("error", (e) => reject("TASKERR: Unable to terminate all instances of dreamdaemon: " + e))
			break
		default:
			reject("Process manipulation is not supported on the host operating system")
			break
		}
	})
	return ret
}

module.exports = run