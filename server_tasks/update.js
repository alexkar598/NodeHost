const config = require("config")

module.exports = async function run({control}){
	if(!config.get("git.enabled")) {
		throw Error("Unable to update gamefiles,git module is disabled")
	}
	let previousHead
	await control.git.revparse(["HEAD"],(_a,hash) => {
		previousHead = hash
	})
	await control.git.pull(config.get("git.remote"),config.get("git.branch"))
	let recompile = await control.forceTask("recompile")
	if(recompile.status !== "ok"){
		control.git.reset(["--hard",previousHead])
		throw Error(`Error in recompilation,reverted changes\n${recompile.message}`)
	}else{
		return "Succesfully updated and recompiled gamefiles"
	}
}