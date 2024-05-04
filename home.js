//Showing certificate details.

let addCertButton;
const token = localStorage.getItem('token');

showAllCertificates();  
createAddCertButton();  
createLogoutButton();

function createAddCertButton() {
    addCertButton = createButton('Add Certificate', (event) => {
        event.preventDefault();
        addCertButton.style.display = 'none';
        populateForm();
    });
    document.body.appendChild(addCertButton);
}

function createLogoutButton() {
    logoutButton = createButton('Logout', (event) => {
        event.preventDefault();
        if(confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            window.location.assign('login.html');
            alert('Logged out successfully!');
        }
        
    });
    document.body.appendChild(logoutButton);
}

async function showAllCertificates() {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:4001/api/certificates', {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const data = await response.json();
        const table = createTable(data)
        const certificatesTable = document.getElementById('certificatesList');
        certificatesTable.appendChild(table);
    } else {
        alert(data);
    }
}

function createTable(data) {
    const certificatesList = data;    
    const table = document.createElement('table');
    
    const headerRow = table.insertRow();
    const headers = ['CertificateID', 'Name', 'Issuer', 'IssuedDate', 'ExpiryDate', 'EmployeeID', 'Edit', 'Delete'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    certificatesList.forEach(certificate => {
        const row = table.insertRow();
        for (const key in certificate) {
            const cell = document.createElement('td');
            cell.textContent = certificate[key];
            row.appendChild(cell);
        }

        const editCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', (event) => {
            event.preventDefault();
            populateForm(certificate);
        });
        editCell.appendChild(editButton);
        
        const deleteCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            if (confirm('Are you sure you want to delete this certificate?')) {
                await deleteCertificate(certificate);
            }
        });
        deleteCell.appendChild(deleteButton);
    });
    
    return table;
}


function populateForm(certificate = null) {
    const form = document.createElement('form');
    let updateContainer = document.getElementById('editcertificate');
    const addContainer = document.getElementById('addcertificate');
    const formFields = ['CertificateID', 'Name', 'Issuer', 'IssuedDate', 'ExpiryDate', 'EmployeeID'];
    const certificateFields = ['certificateId', 'name', 'issuer', 'issueDate', 'expirationDate', 'employeeId'];

    for (let counter = 0; counter < formFields.length; counter++) {
        const label = document.createElement('label');
        label.textContent = formFields[counter] + ': ';
        const input = document.createElement('input');
        input.type = 'text';
        input.name = certificateFields[counter];
        input.id = formFields[counter] + 'Input';

        if (certificate) {
            form.id = 'editForm';
            input.value = certificate[certificateFields[counter]];

            if (certificateFields[counter] == 'certificateId' || certificateFields[counter] == 'employeeId') {
                input.readOnly = true;
            }
        }
        else{
            form.id = 'addForm';
        }

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    }

    if (certificate) {
        addContainer.innerHTML = '';
        updateContainer.innerHTML = '';
        addCertButton.style.display = 'block';
        const updateHeader = document.createElement('h2');
        updateHeader.textContent = 'Update Certificate';
        updateContainer.appendChild(updateHeader);
        const updateButton = createButton('Update', async (event) => {
            event.preventDefault();
            await updateCertificate();
        });
        form.appendChild(updateButton);
        updateContainer.appendChild(form);
    } else {
        updateContainer.innerHTML = '';
        addContainer.innerHTML = '';
        const addHeader = document.createElement('h2');
        addHeader.textContent = 'Add Certificate';
        addContainer.appendChild(addHeader);
        const addButton = createButton('Submit', async (event) => {
            event.preventDefault();
            await addCertificate()
        });
        form.appendChild(addButton);
        addContainer.appendChild(form);
    }
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}



async function addCertificate() {
    const form = document.getElementById('addForm');
    const certificateData = extractFormData(form);
    console.log(certificateData);
    
    const response = await fetch('http://localhost:4001/api/certificates', {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
    });

    if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
        window.location.reload();
    } else {
        alert(responseData.error);
    }
}

async function updateCertificate() {
    const form = document.getElementById('editForm');
    const certificateData = extractFormData(form);
    const certificateId = certificateData.certificateId;
    console.log(certificateData);
    
    const response = await fetch(`http://localhost:4001/api/certificates/${certificateId}`, {
        method: 'PUT',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
    });

    
    if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
        document.getElementById('editcertificate').innerHTML = '';
        window.location.reload();
    } else {
        alert(responseData.error);
    }
}

async function deleteCertificate(certificate) {
    const response = await fetch(`http://localhost:4001/api/certificates/${certificate.certificateId}`, {
        method: 'DELETE',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
        window.location.reload();
    } else {
        alert(responseData.error);
    }
}


function extractFormData(form) {
    const certificateData = {};
    const formFields = form.elements;
    for (let i = 0; i < formFields.length; i++) {
        const field = formFields[i];
        if (field.type !== 'submit') {
            certificateData[field.name] = field.value;
        }
    }
    return certificateData;
}


