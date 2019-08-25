// eslint-disable-next-line no-unused-vars
const byondlink = require("byondlink")

function run({control}){
	let reason = []
	// eslint-disable-next-line no-async-promise-executor
	var ret = new Promise(async (resolve,reject) => {
		
		let kill = await control.forceTask("stopsig")
		reason.push(kill.message)
		if(kill.status !== "ok"){
			reject(reason.join("\n"))
		}

		let start = await control.forceTask("start")
		reason.push(start.message)
		if(start.status !== "ok"){
			reject(reason.join("\n"))
		}

		resolve(reason.join("\n"))
	})
	return ret
}

module.exports = run