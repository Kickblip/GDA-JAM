const button = document.getElementById("requestButton")
const responseDisplay = document.getElementById("serverResponse")

const rootURL = "http://localhost:3000"

button.addEventListener("click", async () => {
    try {
        const res = await fetch(`${rootURL}/data`)
        const data = await res.json()
        responseDisplay.textContent = data.message
    } catch (error) {
        responseDisplay.textContent = "Error fetching data"
    }
})
