var data = "?AAAAAAAA"

var bytes = [0x00,0x83]
var len = new Uint16Array(length(data) + 6).
bytes.push(len)
bytes.push([0x00,0x00,0x00,0x00,0x00])
bytes.push(toASCII(data))
bytes.push(0x00)

tosend = new Uint8Array(bytes)
console.log(tosend)