const formsContainer = document.getElementById('forms');
document.getElementById('signupButton').addEventListener('click', () => showForm(createSignupForm));
document.getElementById('loginButton').addEventListener('click', () => showForm(createLoginForm));

function createForm(formId, formElements, buttonText, onSubmit) {
    const form = document.createElement('form');
    form.id = formId;

    formElements.forEach(element => {
        const input = document.createElement('input');
        input.type = element.type;
        input.id = element.id;
        input.name = element.name;
        input.placeholder = element.placeholder;
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = buttonText;
    form.appendChild(button);

    form.addEventListener('submit', onSubmit);
    return form;
}

function createSignupForm() {
    const formElements = [
        {type: 'text', id: 'signupUsername', placeholder: 'Username', name: 'username'},
        {type: 'password', id: 'signupPassword', placeholder: 'Password', name: 'password'},
        {type: 'text', id: 'signupEmployeeId', placeholder: 'Employee ID', name: 'employeeId'}
    ];

    const onSubmit = async (event) => {
        event.preventDefault();
        const form = document.getElementById('signupForm');
        const signupData = extractFormData(form);

        const response = await fetch('http://localhost:4001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        
        if (response.ok) {
            const data = await response.text();
            alert(data.message);
            showForm(createLoginForm);
        } else {
            alert('User already exists');
        }
    };

    return createForm('signupForm', formElements, 'Signup', onSubmit);
}

function createLoginForm() {
    const formElements = [
        {type: 'text', id: 'loginUsername', placeholder: 'Username', name: 'username'},
        {type: 'password', id: 'loginPassword', placeholder: 'Password', name: 'password'}
    ];

    const onSubmit = async (event) => {
        event.preventDefault();
        const form = document.getElementById('loginForm');
        const loginData = extractFormData(form);
        console.log(loginData);

        const response = await fetch('http://localhost:4001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Login successful');
            window.location.assign('home.html');
        } else {
            alert(data.error);
        }
    };

    return createForm('loginForm', formElements, 'Login', onSubmit);
}

function showForm(formCreator) {
    formsContainer.innerHTML = '';
    formsContainer.appendChild(formCreator());
}

function extractFormData(form) {
    const formData = new FormData(form);
    const userData = {};
    formData.forEach((value, key) => {
        userData[key] = value;
    });
    return userData;
}
