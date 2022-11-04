const axios = require('axios')
const SERVER_HOST = "hello"
const PORT = 8080

async function hit() {
	try {
		result = await axios.get(`http://${SERVER_HOST}:${PORT}`)
		console.log(result.data)
	} catch(error) {
		console.error(error)
	}
}

/** Simulate load by hitting endpoint at constant interval */
(async () => {
	while(true) {
		await new Promise(u => setTimeout(u, 100))
		await hit()
	}
})();

