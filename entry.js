/*
const per = require("permit")
const config = require("config")

const express = require("express")
const fs = require("fs")
const https = require("https")
const permit = new per.Basic()
*/
const byond = require("byondlink")
/*
const privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const app = express()
const httpsServer = https.createServer(credentials,app)
httpsServer.listen(443)
*/
var link = new byond("localhost",5565,18595)
link.send("AAAAAAAA",(e) => {
	console.log(e)
})
link.addListener("topic",(topic) => {
	console.log(topic)
})
link.addListener("error",(err) => {
	console.log(err.message)
})





/*API
app.get(/./,(req,res) => {
	res.status(200).end("<h1>Connection Successful</h1>")
})
*/