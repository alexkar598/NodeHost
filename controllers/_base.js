const config = require("config");
const fs = require("fs");
class controller{
    constructor(){
        this.id = "test";
        this.taskQueue = [];
        this.queueRunning = false
    }
    async runTask(task,...params){
        if(!this.listTasks().includes(task)){ //no executing false tasks or tasks outside directory or something
            return
        }
        let ret = new Promise((resolve,reject) => {
            this.taskQueue.push({resolve: resolve,reject: reject,task: task,params: params})
            let returnObject = {
                status: "",
                message: "",
                payload: null
            };
            setTimeout(() => {
                returnObject.message = "Task timeout,resuming queue,task will continue in background"
                returnObject.status = "timeout";
                resolve(returnObject)
            },config.get("options.tasktimeout"))
        });
        if(this.queueRunning === false){
            setTimeout(this.runQueue.bind(this),config.get("options.queuedelay"))
        }
        return ret
    }

    /**
     * @returns {Array}
     */
    listTasks(){
        try {
            let list = fs.readdirSync(`../server_tasks/${this.id}`);
            list.forEach((value, index, array) => {
                let re = new RegExp(`(.*)(?:\\.\\w+$)`);
                array[index] = re.exec(value)[1]
            });
            return list
        } catch (e) {
            return []
        }
    }
    async runQueue(recur = false){
        if(!this.taskQueue || this.taskQueue.length === 0 || recur !== this.queueRunning){ //sanity checks
            return
        }
        this.queueRunning = true;
        let {resolve,reject,task,params} = this.taskQueue.shift();
        try{

            let returnObject = {
                status: "",
                message: "",
                payload: null
            };
            setTimeout(() => {
                returnObject.message = "Task timeout,resuming queue,task will continue in background"
                returnObject.status = "timeout"
                resolve(returnObject)
            },config.get("options.tasktimeout"))
            try {
                let taskScript = require(`../server_tasks/${this.id}/${task}`)
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
                let taskScript = require(`../server_tasks/${this.id}/${task}`)
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
                returnObject.status = "error"; //errored tasks always have a status of error no matter what
                resolve(returnObject) //payload is set by task
            }
        });
        return ret
    }
}
let t = new controller();
console.log(t.listTasks());
t.runTask("old").then((e) => {
    console.log(e.message);
}).catch((e) => {
    console.log(`error while running task: ${e}`)
});
module.exports = controller;