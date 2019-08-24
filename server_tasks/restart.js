// eslint-disable-next-line no-unused-vars
const byondlink = require("byondlink")

function run({control,payload}){
	return new Promise((resolve,reject)=>{
		/**
		 * @type {byondlink}
		 */
		let bylink = control.link
		bylink.send("?action=restart",(e) => {
			if(e == true){
				resolve("Server has accepted restart signal")
			}else{
				payload.status = "warn"
				resolve("Server has refused restart signal")
			}
		})
		bylink.on("error",(e) => reject("TASKERR: ByondLink emitted an error: " + e))
	})
}

module.exports = run