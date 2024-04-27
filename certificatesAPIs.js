//APIs to fetch data from a database.

const express = require("express");
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const app = express();
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
        const orderBy = request.query.orderBy || "issueDate";
        const query = `select * from certificates where employeeId = \'${employeeId}\' order by ${orderBy} ${sortOrder}`;
        const data = await dbConnection.all(query);
        if (data.length > 0) {
            response.send(data);
        } else {
            response.status(404).send(`No certificates found for employee with ID ${employeeId}`);
        }
    } catch (error) {
        response.status(500).send(error);
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
        const result = await dbConnection.run(query, queryParameters);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(201).send(certificateData);
        } else {
            response.status(500).send("Failed to insert certificate data");
        }
    }
    catch(error){
        console.error("Error inserting data into the database:", error);
        response.status(500).send(error);
    }
    
});

app.put("/api/:employeeId/certificates/:certificateId", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateId = request.params.certificateId;
        const updatedData = request.body;
        const query = `update certificates set name = ?, issuer = ?, issueDate = ?, expirationDate = ? where certificateId = ? and employeeId = ?`;
        const queryParameters = [updatedData.name, updatedData.issuer, updatedData.issueDate, updatedData.expirationDate, certificateId, employeeId];
        const result = await dbConnection.run(query, queryParameters);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send(updatedData);
        } else {
            response.status(404).send(`Certificate with id ${certificateId} not found`);
        }
    }
    catch(error){
        console.error("Error updating certificate data:", error);
        response.status(500).send(error);
    }
});

app.delete("/api/:employeeId/certificates/:certificateId", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateId = request.params.certificateId;
        const query = `delete from certificates where certificateId = ? and employeeId = ?`;
        const queryParameters = [certificateId, employeeId];
        const result = await dbConnection.run(query, queryParameters);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send(`Certificate with id ${certificateId} has been deleted successfully`);
        } else {
            response.status(404).send(`Certificate with id ${certificateId} not found`);
        }
    }
    catch(error){
        console.error("Error updating certificate data:", error);
        response.status(500).send(error);
    }
});

app.get("/api/:employeeId/certificates/search/:certificateId", (request, response)=>{
    response.send();
});

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})



