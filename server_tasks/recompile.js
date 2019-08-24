const spawnSync = require("child_process").spawnSync
const config = require("config")
async function run(){
	if(!config.get("paths.dme")){
		throw Error("DME path not specified,recompilation is disabled")
	}
	let results = spawnSync(config.get("paths.dm_binary"),[config.get("paths.dme")])
	if(results.status === 0){
		return "DMB was recompiled successfully"
	}else{
		throw Error(`Unable to recompile,displaying DM log: \n\n${results.stdout.toString()}`)
	}
}


module.exports = run