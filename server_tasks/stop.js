// eslint-disable-next-line no-unused-vars
const byondlink = require("byondlink")
const config = require("config")

function run({control}){
	return new Promise((resolve,reject)=>{
		/**
		 * @type {byondlink}
		 */
		let bylink = control.link
		bylink.send("?action=shutdown",(e) => {
			if(e == false){
				resolve("Server has refused shutdown signal")
			}else if(config.get("options.forcekillafterstop")){
				setTimeout(() => {
					control.runTask("forcekill") //if the server reports having shutdown,forcekill it after a couple of seconds
					resolve("Server has accepted shutdown signal and dreamdaemon has been terminated")
				},config.get("options.stoptime"))
			}else{
				setTimeout(() => {
					resolve("Server has accepted shutdown singal")
				},config.get("options.stoptime"))
			}
		})
		bylink.on("error",(e) => reject("TASKERR: ByondLink emitted an error: " + e))
	})
}

module.exports = run