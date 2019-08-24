function run({control}){
	let reason = []
	// eslint-disable-next-line no-async-promise-executor
	var ret = new Promise(async (resolve,reject) => {
		let cmdhandler = control.duplicate()
		let stop = await cmdhandler.runTask("forcekill")
		reason.push(stop.message)
		if(stop.status === "error"){
			reject(reason.join("\n"))
		}

		let start = await cmdhandler.runTask("start")
		reason.push(start.message)
		if(start.status === "error"){
			reject(reason.join("\n"))
		}

		resolve(reason.join("\n"))
	})
	return ret
}

module.exports = run