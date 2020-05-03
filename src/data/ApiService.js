const getData = (queries) => new Promise(async (resolve, reject) => {
    try {
        const response = await fetch("https://brfenergi.se/task-planner/MakumbaQueryServlet", {
            method: "POST",
            credentials: 'include',
            body: "request=" + encodeURIComponent(JSON.stringify({ queries: queries })) + "&analyzeOnly=false"
        })
        const responseJson = await response.json();
        resolve(responseJson)
    } catch (error) {
        reject(error)
    }
})

export default {
    getData
}