const fs = require("fs")

class serverControl{
	constructor({binary_path,world_path,ddlog}){
		this.binary_path = binary_path
		this.world_path = world_path
		this.ddlog = ddlog
		this.gameserver = null
	}
	runTask(task,...args){
		let taskScript = require("./server_tasks/" + task)
		try {
			return taskScript(this,...args)
		} catch (error) {
			return `Unhandled error in task: (${error.message})`
		}
	}
	listTasks(){
		let list = fs.readdirSync("./server_tasks")
		list.forEach((value,index,array) => {
			let re = new RegExp(/(.*)(?:\.\w+$)/)
			array[index] = re.exec(value)[1]
		})
		return list
	}
}

module.exports = serverControl