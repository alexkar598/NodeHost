// eslint-disable-next-line no-unused-vars
module.exports = async ({control},option,param) => {
	switch (option) {
	case "clsprocess":
		control.gameserver = null
		return "gameserver is now null"
	case "clstskqueue":
		control.taskQueue = []
		control.queueRunning = false
		return "taskqueue cleared"
	default:
		throw Error("bad debug option")
	}
}