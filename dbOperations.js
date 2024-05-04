//CRUD operations to fetch data from the database.

const {connectToDataBase} = require('./dbConnection.js');

let dbConnection;

async function startConnectionToDataBase() {
    try {
        dbConnection = await connectToDataBase();
        console.log('Connected to the database');        
      
    } catch (error) {
        console.error('Failed to connect to the database: ', error);
    }
}
startConnectionToDataBase();

async function getAllCertificates(employeeId, orderBy, sortOrder)
{
    const query = `select * from certificates where employeeId = ? order by ${orderBy} ${sortOrder}`;
    const queryParameters = [employeeId];
    return await dbConnection.all(query, queryParameters);
}

async function insertCertificate(certificateData, employeeId)
{
    const {certificateId, name, issuer, issueDate, expirationDate} = certificateData;
    const query = 'insert into certificates(certificateId, name, issuer, issueDate, expirationDate, employeeId)values (?, ?, ?, ?, ?, ?)';
    const queryParameters = [certificateId, name, issuer, issueDate, expirationDate, employeeId];
    return await dbConnection.run(query, queryParameters);                      
}

async function editCertificate(certificateData, employeeId)
{
    console.log(certificateData);
    const {certificateId, name, issuer, issueDate, expirationDate} = certificateData;
    const query = 'update certificates set name = ?, issuer = ?, issueDate = ?, expirationDate = ? where certificateId = ? and employeeId = ?';
    const queryParameters = [name, issuer, issueDate, expirationDate, certificateId, employeeId];
    return await dbConnection.run(query, queryParameters);                     
}

async function deleteCertificate(employeeId, certificateId)
{
    const query = 'delete from certificates where certificateId = ? and employeeId = ?';
    const queryParameters = [certificateId, employeeId];  
    return await dbConnection.run(query, queryParameters);                   
}

async function insertUserCredentials(username, hashedPassword, employeeId) {
    try {
        const existingUser = await dbConnection.get('select * from employees where username = ?', username);
        if (existingUser) {
            return { changes: 0 }; 
        }
        return await dbConnection.run('update employees set username = ?, password = ? WHERE employeeId = ?', [username, hashedPassword, employeeId]);
    }catch(error) {
        throw error;
    }
}

async function getEmployeeCredentials(username) {
    try {
        const userData = await dbConnection.get('SELECT * FROM employees WHERE username = ?', username);
        return userData;
    } catch (error) {
        throw error;
    }
};

async function insertToken(token, employeeId) {
    try {
        const query = 'UPDATE employees SET token = ? WHERE employeeId = ?';
        return await dbConnection.run(query, [token, employeeId]);
        // console.log('Token inserted successfully');
    } catch (error) {
        throw error;
    }
}

async function validateToken(token){
    const query = 'SELECT employeeId from employees where token = ?';
    let isTokenValid = false;
    try{
        const result = await dbConnection.get(query, token);
        if(result){
            isTokenValid = true;
        }
        return { employeeId: result.employeeId, isTokenValid };
    }catch(error){
        throw error;
    }
}

module.exports = {getAllCertificates, insertCertificate, editCertificate, deleteCertificate, insertUserCredentials, getEmployeeCredentials, insertToken, validateToken};