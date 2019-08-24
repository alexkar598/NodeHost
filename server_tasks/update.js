const config = require("config")
const gitc = require("simple-git")

module.exports = async function run({control}){
	if(!config.get("git.enabled")) {
		throw Error("Unable to update gamefiles,git module is disabled")
	}
	control.fetch(config.get("git.remote"),config.get("git.branch"))
}