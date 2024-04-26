## 1.Certificates List:
```
Method : GET 
Endpoint : /api/:employeeId/certificates 
Query params : ?sort=desc
Payload : Empty
Response Json :[{"certificateId": "P1001",
      "name": "Python Programming Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-04-2024",
      "expirationDate": "23-03-2025"}, 
      {"certificateId": "A0504",
      "name": "AWS Certified Solutions Architect - Associate",
      "issuer": "Amazon Web Services",
      "issuedDate": "15-03-2023"
      "expirationDate": "14-04-2025"}]
    
Response Code : 200(OK)/400(Bad Request)/401(Unauthorized)/500(Internal Server Error)
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
Response Json : {
      "certificateId": "M0953",
      "name": "Machine Learning Engineer Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-04-2024",
      "expirationDate": "23-03-2025"
    }
Response Code : 201(Created)/200(OK)/400(Bad Request)/401(Unauthorized)/500(Internal Server Error)
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
    {
      "certificateId": "M0953",
      "name": "Machine Learning Engineer Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-05-2023",
      "expirationDate": "23-04-2025"
    }
Response Code : 204(No Content)/200(OK)/400(Bad Request)/401(Unauthorized)/500(Internal Server Error)
```

## 4. Delete certificate
```
Method : Delete 
Endpoint : /api/:employeeId/certificates/:certificateId 
Query params : None
Payload : Empty
Response Json : {"message"}
Response Code : 204(No Content)/200(OK)/400(Bad Request)/401(Unauthorized)/500(Internal Server Error)
```

## 5. Search certificate
```
Method : GET 
Endpoint : /api/:employeeId/certificates/search/:certificateId
Query params : ? = M0953
Payload : Empty
Response Json :{
      "certificateId": "M0953",
      "name": "Machine Learning Engineer Certificate",
      "issuer": "Coursera",
      "issuedDate": "24-04-2024",
      "expirationDate": "23-03-2025"
    }
    
Response Code : 200(OK)/400(Bad Request)/401(Unauthorized)/500(Internal Server Error)
```