function run({control}){
	let reason = []
	// eslint-disable-next-line no-async-promise-executor
	var ret = new Promise(async (resolve,reject) => {
		let stop = await control.forceTask("forcekill")
		reason.push(stop.message)
		if(stop.status === "error"){
			reject(reason.join("\n"))
		}

		let start = await control.forceTask("start")
		reason.push(start.message)
		if(start.status === "error"){
			reject(reason.join("\n"))
		}

		resolve(reason.join("\n"))
	})
	return ret
}

module.exports = run