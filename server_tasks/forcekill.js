// eslint-disable-next-line no-unused-vars
const cprocess = require("child_process")
function run(control){
	/**
	 * @type {cprocess.ChildProcess}
	 */
	let srv = control.gameserver
	if(!srv){
		return "No server is currently attached"
	}else if(srv.killed){
		return "Dreamdaemon is already being killed"
	}else{
		srv.kill()
		return "Dreadaemon is being killed"
	}
}

module.exports = run