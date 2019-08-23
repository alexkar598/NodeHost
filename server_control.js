class serverControl{
	constructor({binary_path,world_path,ddlog}){
		this.binary_path = binary_path
		this.world_path = world_path
		this.ddlog = ddlog
		this.gameserver = null
	}
	runTask(task,...args){
		let taskScript = require("./server_tasks/" + task)
		taskScript(this,...args)
	}
}

module.exports = serverControl