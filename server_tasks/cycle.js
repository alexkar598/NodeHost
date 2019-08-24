function run({control}){
	let reason = []
	let altsrv = control.duplicate()
	// eslint-disable-next-line no-async-promise-executor
	var ret = new Promise(async (resolve,reject) => {
		let kill = await altsrv.runTask("stop")
		reason.push(kill.message)
		if(kill.status === "error"){
			reject(reason.join("\n"))
		}

		if(control.gameserver && control.gameserver.killed === false){
			let stop = await altsrv.runTask("forcekill")
			reason.push(stop.message)
			if(stop.status === "error"){
				reject(reason.join("\n"))
			}
		}

		let start = await altsrv.runTask("start")
		reason.push(start.message)
		if(start.status === "error"){
			reject(reason.join("\n"))
		}

		resolve(reason.join("\n"))
	})
	return ret
}

module.exports = run