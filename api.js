//APIs to fetch the data from a database.

const express = require('express');
const {getAllCertificates, insertCertificate, editCertificate, deleteCertificate} = require('./dbOperations.js');
const app = express();
app.use(express.json());
const port = 4000;

app.get('/api/:employeeId/certificates', async (request, response) => {
	try {
        const employeeId = request.params.employeeId;
        const sortOrder = request.query.sort || "asc";
        const orderBy = request.query.orderBy || "issueDate";
        const certificatesData = await getAllCertificates(employeeId, orderBy, sortOrder);
        if (certificatesData.length > 0) {
            response.send(certificatesData);
        } else {
            response.status(404).send("No certificates found");
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

app.post("/api/:employeeId/certificates", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateData = request.body;
        const result = await insertCertificate(certificateData, employeeId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(201).send(certificateData);
        } else {
            response.status(500).send("Failed to insert data");
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
        const certificateData = request.body;
        const result = await editCertificate(certificateData, employeeId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send(certificateData);
        } else {
            response.status(404).send("Certificate is not found");
        }
    }
    catch(error){
        console.error("Error updating data:", error);
        response.status(500).send(error);
    }
});

app.delete("/api/:employeeId/certificates/:certificateId", async (request, response)=>{
    try{
        const employeeId = request.params.employeeId;
        const certificateId = request.params.certificateId;
        const result = await deleteCertificate(employeeId, certificateId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send("Certificate is deleted successfully");
        } else {
            response.status(404).send("Certificate is not found");
        }
    }
    catch(error){
        console.error("Error deleting certificate data:", error);
        response.status(500).send(error);
    }
});

app.get("/api/:employeeId/certificates/search/:certificateId", async (request, response)=>{
    response.send("");
});


app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})