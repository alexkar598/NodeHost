// eslint-disable-next-line no-unused-vars
const cprocess = require("child_process")
function run({control}){
	/**
	 * @type {cprocess.ChildProcess}
	 */
	let srv = control.gameserver
	let ret = new Promise((resolve,reject)=>{
		if(!srv){
			reject("No server is currently attached")
		}else if(srv.killed){
			reject("Dreamdaemon is already being killed")
		}else{
			srv.kill()
			srv.addListener("exit",() => {
				resolve("Dreamdaemon has been force killed successfully")
			})
		}
	})
	return ret
}

module.exports = run