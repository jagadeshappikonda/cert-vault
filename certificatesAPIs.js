//APIs to fetch data from a database.

const express = require("express");
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const app = express();
const port = 4000;
let dbConnection;
async function connectToDataBase() {
    try {
        dbConnection = await open({ filename: 'Certificates.db', driver: sqlite3.Database });
        console.log("Connected to database");        
      
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
}

connectToDataBase();

app.get("/api/:employeeId/certificates", async (request, response) => {
    try {
        const data = await dbConnection.all("SELECT * FROM certificates");
        console.log(data);
        response.send(data);
    } catch (error) {
        console.error("Error retrieving data from the database:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.post("/api/:employeeId/certificates/add", (request, response)=>{
    response.send();
});

app.put("/api/:employeeId/certificates/edit", (request, response)=>{
    response.send();
});

app.delete("/api/:employeeId/certificates/delete", (request, response)=>{
    response.send();
});

app.get("/api/:employeeId/certificates/search", (request, response)=>{
    response.send();
});

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
})



