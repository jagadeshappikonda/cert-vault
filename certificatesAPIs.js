//APIs to fetch data from a database.

const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require('cors');
const {open} = require("sqlite");
const app = express();
app.use(cors());
app.use(express.json());
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
        const employeeId = request.params.employeeId;
        const sortOrder = request.query.sort || "asc";
        const query = `select * from certificates where employeeId = \'${employeeId}\' order by issueDate ${sortOrder}`;
        const data = await dbConnection.all(query);
        console.log(data);
        response.send(data);
    } catch (error) {
        console.error("Error retrieving data from the database:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.post("/api/:employeeId/certificates", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateData = request.body;
        const query = `insert into certificates(certificateId, name, issuer, issueDate, expirationDate, employeeId)values
                        (?, ?, ?, ?, ?, ?)`;
        const queryParameters = [certificateData.certificateId, certificateData.name, certificateData.issuer,
                                    certificateData.issueDate, certificateData.expirationDate, employeeId];
        await dbConnection.run(query, queryParameters);
        response.status(201).send(certificateData);
    }
    catch(error){
        console.error("Error inserting data into the database:", error);
        response.status(500).send("Internal Server Error");
    }
    
});

app.put("/api/:employeeId/certificates/:certificateId", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateId = request.params.certificateId;
        const updatedData = request.body;
        const query = `update certificates set name = ?, issuer = ?, issueDate = ?, expirationDate = ? where certificateId = ? and employeeId = ?`;
        const queryParameters = [updatedData.name, updatedData.issuer, updatedData.issueDate, updatedData.expirationDate, certificateId, employeeId];
        await dbConnection.run(query, queryParameters);
        response.status(200).send(updatedData);
    }
    catch(error){
        console.error("Error updating certificate data:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.delete("/api/:employeeId/certificates/:certificateId", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateId = request.params.certificateId;
        const query = `delete from certificates where certificateId = ? and employeeId = ?`;
        const queryParameters = [certificateId, employeeId];
        await dbConnection.run(query, queryParameters);
        response.status(200).send(`Certificate with id ${certificateId} has been deleted successfully`);
    }
    catch(error){
        console.error("Error updating certificate data:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.get("/api/:employeeId/certificates/search/:certificateId", (request, response)=>{
    response.send();
});

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
})



