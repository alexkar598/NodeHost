const config = require("config")
const recurReaddirSync = require("recursive-readdir-sync")
class serverControl{
	constructor({link,git,cfg}){
		this.link = link
		this.git = git
		this.data = cfg
		this.gameserver = null
		this.taskQueue = []
		this.queueRunning = false
	}
	async runTask(task){
		if(!this.listTasks().includes(task)){ //no executing false tasks or tasks outside directory or something
			return
		}
		let ret = new Promise(((resolve,reject) => {
			this.taskQueue.push({resolve: resolve,reject: reject,task: task})
			let returnObject = {
				status: "",
				message: "",
				payload: null
			}
			setTimeout(() => {
				returnObject.message = "Task timeout,resuming queue,task will continue in background"
				returnObject.status = "timeout"
				resolve(returnObject)
			},config.get("options.tasktimeout"))
		}).bind(this))
		if(this.queueRunning == false){
			this.runQueue()
		}
		return ret
	}
	listTasks(){
		let list = recurReaddirSync("./server_tasks")
		list.forEach((value,index,array) => {
			let re = new RegExp(/server_tasks\\(.*)(?:\.\w+$)/)
			array[index] = re.exec(value)[1]
		})
		return list
	}
	async runQueue(){
		if(this.taskQueue.length == 0 || this.queueRunning){ //sanity checks
			return
		}
		this.queueRunning = true
		let {resolve,reject,task} = this.taskQueue.shift()
		try{
			
			let returnObject = {
				status: "",
				message: "",
				payload: null
			}
			setTimeout(() => {
				returnObject.message = "Task timeout,resuming queue,task will continue in background"
				returnObject.status = "timeout"
				resolve(returnObject)
			},config.get("options.tasktimeout"))
			try {
				let taskScript = require("./server_tasks/" + task)
				// eslint-disable-next-line require-atomic-updates
				returnObject.message = await taskScript({control:this,payload: returnObject}) //message is whatever string the task returns
				if(returnObject.status == ""){
					// eslint-disable-next-line require-atomic-updates
					returnObject.status = "ok" //unless overrode,it will have a status of ok
				}
				resolve(returnObject) //payload is set by task
			} catch (error) {
				// eslint-disable-next-line require-atomic-updates
				returnObject.message = `Error in task ${task}: \n${error}\n` //message is fixed to error message
				// eslint-disable-next-line require-atomic-updates
				returnObject.status = "error" //errored tasks always have a status of error no matter what
				resolve(returnObject) //payload is set by task
			}	
		}catch(error){
			reject(error)
		}
		if(this.taskQueue.length != 0){
			setTimeout(this.runQueue,config.get("options.queuedelay"))
		}else{
			this.queueRunning = false
		}
	}
	async forceTask(task) {
		// eslint-disable-next-line no-async-promise-executor
		let ret = new Promise(async (resolve) => {
			let returnObject = {
				status: "",
				message: "",
				payload: null
			}
			try {
				let taskScript = require("./server_tasks/" + task)
				// eslint-disable-next-line require-atomic-updates
				returnObject.message = await taskScript({control:this,payload: returnObject}) //message is whatever string the task returns
				if(returnObject.status == ""){
					// eslint-disable-next-line require-atomic-updates
					returnObject.status = "ok" //unless overrode,it will have a status of ok
				}
				resolve(returnObject) //payload is set by task
			} catch (error) {
				// eslint-disable-next-line require-atomic-updates
				returnObject.message = `Error in task ${task}: \n${error}\n` //message is fixed to error message
				// eslint-disable-next-line require-atomic-updates
				returnObject.status = "error" //errored tasks always have a status of error no matter what
				resolve(returnObject) //payload is set by task
			}	
		})
		return ret
	}
}

module.exports = serverControl