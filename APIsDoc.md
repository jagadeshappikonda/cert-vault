## 1.Certificates List:
```
Method : GET 
Endpoint : /api/:employeeId/certificates 
Query params : ?orderBy="issueDate"/"name"/"issuer"/"expirationDate"&sort="desc"
Payload : Empty
Response Json :
      Success: [{
        "certificateId": "P1001",
        "name": "Python Programming Certificate",
        "issuer": "Coursera",
        "issuedDate": "24-04-2024",
        "expirationDate": "23-03-2025"
        }, 
        {
        "certificateId": "A0504",
        "name": "AWS Certified Solutions Architect - Associate",
        "issuer": "Amazon Web Services",
        "issuedDate": "15-03-2023"
        "expirationDate": "14-04-2025"
        }, ...]
      Error: {"errorCode": code, "message": errorMessage}
    
Response Code : 200(OK)/400(Bad Request)/500(Internal Server Error)
```

## 2. Add cretificate.
```
Method : Post 
Endpoint : /api/:employeeId/certificates
Query params : None
Payload : 
    {
      "certificateId": "M0953",
      "name": "Machine Learning Engineer Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-04-2024",
      "expirationDate": "23-03-2025"
    }
Response Json : 
    Success: {
        "certificateId": "M0953",
        "name": "Machine Learning Engineer Certificate",
        "issuer": "Coursera",
        "issuedDate": "24-04-2024",
        "expirationDate": "23-03-2025"
      }
    Error: {"errorCode": code, "message": errorMessage}
Response Code : 201(Created)/200(OK)/400(Bad Request)/500(Internal Server Error)
```

## 3. Edit certificate
```
Method : Put 
Endpoint : /api/:employeeId/certificates/:certificateId 
Query params : None
Payload : 
    {
      "issuedDate": "24-05-2023"
      "expirationDate": "23-04-2025"
    }
Response Json : 
    Success: {
        "certificateId": "M0953",
        "name": "Machine Learning Engineer Certificate",
        "issuer": "Coursera",
        "issuedDate": "24-05-2023",
        "expirationDate": "23-04-2025"
      }
    Error: {"errorCode": code, "message": errorMessage}
Response Code : 204(No Content)/200(OK)/400(Bad Request)/500(Internal Server Error)
```

## 4. Delete certificate
```
Method : Delete 
Endpoint : /api/:employeeId/certificates/:certificateId 
Query params : None
Payload : Empty
Response Json : 
      Success: {"successResponseCode": code, "message": "successMessage"}
      Error: {"errorCode": code, "message": errorMessage}
Response Code : 204(No Content)/200(OK)/400(Bad Request)/500(Internal Server Error)
```

## 5. Search certificate
```
Method : GET 
Endpoint : /api/:employeeId/certificates/search/:certificateId
Query params :None
Payload : Empty
Response Json :
    Success: {
      "certificateId": "M0953",
      "name": "Machine Learning Engineer Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-04-2024",
      "expirationDate": "23-03-2025"
    }
    Error: {"errorCode": code, "message": errorMessage}
    
Response Code : 200(OK)/400(Bad Request)/500(Internal Server Error)
```