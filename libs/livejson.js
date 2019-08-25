const fs = require("fs")
const path = require("path")



module.exports = class liveJSON {
	constructor(file){
		try {
			fs.accessSync(file, fs.constants.W_OK | fs.constants.R_OK)
		} catch (error) {
			throw Error(`Unable to open ${file},check that the user running has write and read access`)
		}
		let json
		try {
			json = JSON.parse(fs.readFileSync(file))
		} catch (error) {
			throw Error(`Unable to parse JSON file (${file})`)
		}
		let handler = {
			// eslint-disable-next-line no-unused-vars
			get: (obj,prop) => {
				if(prop === "__name" || prop === "__stack" || typeof(prop) == "symbol"){
					return obj[prop]
				}
				console.log(`get trap prop: ${prop}`)
				let json
				let stack = obj.__stack ? obj.__stack : []
				try {
					json = JSON.parse(fs.readFileSync(file))
				} catch (error) {
					throw Error(`Unable to parse JSON file (${file})`)
				}
				let current = json
				for (let i = 0; i < stack.length; i++) {
					current = current[stack[i]]
					
				}
				let retval = current[prop] ? current[prop] : null
				if(typeof(retval) === "object" && prop !== "__proto__" && retval !== null){
					retval = new Proxy(current[prop],handler)
					retval["__name"] = prop
					stack.push(prop)
					retval["__stack"] = stack
				}
				return retval
			},
			// eslint-disable-next-line no-unused-vars
			set: (obj,prop,value) => {
				if(prop === "__name" || prop === "__stack"){
					obj[prop] = value
					return true
				}
				let json
				try {
					json = JSON.parse(fs.readFileSync(file))
				} catch (error) {
					throw Error(`Unable to parse JSON file (${error})`)
				}
				json[prop] = value
				try {
					fs.writeFileSync(file,JSON.stringify(json))
				} catch (error) {
					throw Error(`Unable to write JSON file (${error})`)
				}
			},
			// eslint-disable-next-line no-undef
			has: (_obj,prop) => {
				let json
				try {
					json = JSON.parse(fs.readFileSync(file))
				} catch (error) {
					throw Error(`Unable to parse JSON file (${file})`)
				}
				return json.has(prop)
			}
		}
		return new Proxy(json,handler)
	}
}

var t = new module.exports(path.resolve(__dirname,"test.json"))
var g = new module.exports(path.resolve(__dirname,"test.json")).cat[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]

console.log(g)