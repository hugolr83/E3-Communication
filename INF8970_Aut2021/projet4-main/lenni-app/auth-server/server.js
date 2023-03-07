
const app = require('./app')

const PORT = 5000

app.set('port', PORT)
const server = app.listen(PORT, () => {
    console.log("server started on port 5000");
})

module.exports = server;