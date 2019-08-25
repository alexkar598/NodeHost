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
	async runTask(task,...params){
		if(!this.listTasks().includes(task)){ //no executing false tasks or tasks outside directory or something
			return
		}
		let ret = new Promise(((resolve,reject) => {
			this.taskQueue.push({resolve: resolve,reject: reject,task: task,params: params})
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
			setTimeout(this.runQueue.bind(this),config.get("options.queuedelay"))
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
	async runQueue(recur = false){
		if(!this.taskQueue || this.taskQueue.length == 0 || recur !== this.queueRunning){ //sanity checks
			return
		}
		this.queueRunning = true
		let {resolve,reject,task,params} = this.taskQueue.shift()
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
				returnObject.message = await taskScript({control:this,payload: returnObject},...params) //message is whatever string the task returns
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
			setTimeout((() => {this.runQueue(true)}).bind(this),config.get("options.queuedelay"))
		}else{
			this.queueRunning = false
		}
	}
	async forceTask(task,...params) {
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
				returnObject.message = await taskScript({control:this,payload: returnObject},...params) //message is whatever string the task returns
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