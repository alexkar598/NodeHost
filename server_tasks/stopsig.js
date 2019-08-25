// eslint-disable-next-line no-unused-vars
const byondlink = require("byondlink")
const config = require("config")
const fs = require("fs")
const path = require("path")

function run({control,payload}){
	return new Promise((resolve,reject)=>{
		/**
		 * @type {byondlink}
		 */
		let bylink = control.link
		bylink.send("?action=shutdown",(e) => {
			if(!e){
				payload.status = "warn"
				resolve("Server has refused shutdown signal")
			}else{
				let fd
				let intid = setInterval(() => {
					try{
						console.log("attempting to read lockfile")
						fd = fs.openSync(path.resolve(
							config.get("paths.gamedir"),
							config.get("paths.rsc") + ".lk"
						))
					}catch(e){ //if it shits its pants,the lockfile is dead and it means the server is also dead
						try {
							fs.closeSync(fd)
						} catch (error) {
							setTimeout(Function(), 10000)//noop
						}
						
						clearInterval(intid)
						if(config.get("options.killafterstop")){
							control.runTask("kill")
							resolve("Server has accepted shutdown signal and dreamdaemon has been terminated")
						}else{
							resolve("Server has accepted shutdown singal and closed down")
						}
					}
				},1000)
			}
		})
		bylink.on("error",(e) => reject("TASKERR: ByondLink emitted an error: " + e))
	})
}

module.exports = run