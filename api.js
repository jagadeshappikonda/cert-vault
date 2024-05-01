//APIs to fetch the data from a database.
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const {getAllCertificates, insertCertificate, editCertificate, deleteCertificate, insertUserCredentials, getEmployeeCredentials} = require('./dbOperations.js');
const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;
const secretKey = '4c068808f0ca983fcdf8dc7b54ba0504baf060a38a5fdebd9b6a1d97dc9222a';



app.post('/signup', async (request, response) => {
    const { username, password, employeeId} = request.body;
    console.log(request.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const result = await insertUserCredentials(username, hashedPassword, employeeId);
        const rowsAffected = result.changes;
        if(rowsAffected > 0){
            response.status(201).send('User created');
        }
        else if(rowsAffected == 0){
            response.send('Username already exists');
        }
        else{
            response.status(500).send('Failed to create user');
        }
        
      } catch (error) {
        console.error('Error creating user:', error);
        response.status(500).send('Internal Server Error');
      }
    
  });

function authenticateToken(request, response, next){
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send({ error: 'Unauthorized: Missing Authorization header' });
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        return response.status(401).send({ error: 'Unauthorized: Token not provided' });
    }
    try{
        const decoded = jwt.verify(token, secretKey);
        request.employeeId = decoded.employeeId;
        next();
    }catch(error){
        console.error('Error verifying token:', error);
        return response.status(403).send({ error: 'Forbidden: Invalid or expired token' });
    }
    
};

app.use('/api', authenticateToken);

app.post('/login', async (request, response) => {
    const { username, password } = request.body;
    try {
        const userData = await getEmployeeCredentials(username);
        if (!userData) {
            return response.status(401).send({ error: 'Invalid credentials'});
        }
        const hashPassword = userData.password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);
        if (!passwordMatch) {
            
            return response.status(401).send({error: 'Invalid credentials'});
        }
        const employeeId = userData.employeeId;
        const token = jwt.sign({employeeId}, secretKey);
        response.send({token});
    } catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({error: 'Internal Server Error'});
    }
});

app.get('/api/certificates', async (request, response) => {
	try {
        const employeeId = request.employeeId;
        const sortOrder = request.query.sort || 'asc';
        const orderBy = request.query.orderBy || 'issueDate';
        const certificatesData = await getAllCertificates(employeeId, orderBy, sortOrder);
        if (certificatesData.length > 0) {
            response.send(certificatesData);
        } else {
            response.status(404).send('No certificates found');
        }
    } catch (error) {
        response.status(500).send(error);
    }
})

app.post('/api/certificates', async (request, response)=>{
    try{
        const employeeId = request.employeeId;
        const certificateData = request.body;
        const result = await insertCertificate(certificateData, employeeId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(201).send(certificateData);
        } else {
            response.status(500).send('Failed to insert data');
        }
    }
    catch(error){
        console.error('Error inserting data into the database:', error);
        response.status(500).send(error);
    }
});

app.put('/api/certificates/:certificateId', async (request, response)=>{
    try{
        const employeeId = request.employeeId;
        const certificateData = request.body;
        const result = await editCertificate(certificateData, employeeId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send(certificateData);
        } else {
            response.status(404).send('Certificate is not found');
        }
    }
    catch(error){
        console.error('Error updating data:', error);
        response.status(500).send(error);
    }
});

app.delete('/api/certificates/:certificateId', async (request, response)=>{
    try{
        const employeeId = request.employeeId;
        const certificateId = request.params.certificateId;
        const result = await deleteCertificate(employeeId, certificateId);
        const rowsAffected = result.changes;
        if (rowsAffected > 0) {
            response.status(200).send('Certificate is deleted successfully');
        } else {
            response.status(404).send('Certificate is not found');
        }
    }
    catch(error){
        console.error('Error deleting certificate data:', error);
        response.status(500).send(error);
    }
});



app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})