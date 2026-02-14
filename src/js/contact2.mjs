// contact.js - Contact form functionality
export function initContactPage() {
    console.log('Initializing contact page...');

    // Obtener elementos del formulario
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const successMessage = document.getElementById('success-message');

    // DEBUGGING - verificar que todos los elementos existen
    console.log('Form:', contactForm);
    console.log('Name input:', nameInput);
    console.log('Success message:', successMessage);

    // Cuando se envía el formulario
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    } else {
        console.error('Contact form not found!');
        return;
    }

    // Validar campos cuando el usuario sale de ellos
    if (nameInput) {
        nameInput.addEventListener('blur', function () {
            console.log('Name blur triggered');
            validateName();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            console.log('Email blur triggered');
            validateEmail();
        });
    }

    if (messageTextarea) {
        messageTextarea.addEventListener('blur', function () {
            console.log('Message blur triggered');
            validateMessage();
        });
    }

    // Función principal: manejar el envío del formulario
    function handleSubmit(event) {
        event.preventDefault();
        console.log('Form submitted!');

        // Validar todos los campos
        const nameValid = validateName();
        const emailValid = validateEmail();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();

        console.log('Validation results:', {
            nameValid: nameValid,
            emailValid: emailValid,
            subjectValid: subjectValid,
            messageValid: messageValid
        });

        // Si algo está mal, mostrar error y parar
        if (!nameValid || !emailValid || !subjectValid || !messageValid) {
            showNotification('Please fix the errors in the form.', 'error');
            return;
        }

        // Recoger los datos del formulario
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectSelect.value,
            message: messageTextarea.value.trim(),
            submittedAt: new Date().toISOString()
        };

        console.log('Form data:', formData);

        // Guardar en localStorage
        saveFormData(formData);

        // Limpiar el formulario
        contactForm.reset();
        clearAllErrors();

        // Mostrar mensaje de éxito
        showSuccessMessage();
    }

    // VALIDACIONES
    function validateName() {
        console.log('Validating name...');

        if (!nameInput) {
            console.error('Name input not found!');
            return false;
        }

        const name = nameInput.value.trim();
        const errorElement = document.getElementById('name-error');

        console.log('Name value:', name);
        console.log('Error element:', errorElement);

        if (name === '') {
            showError(errorElement, 'Name is required.');
            return false;
        }

        if (name.length < 2) {
            showError(errorElement, 'Name must be at least 2 characters.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateEmail() {
        console.log('Validating email...');

        if (!emailInput) {
            console.error('Email input not found!');
            return false;
        }

        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');

        if (email === '') {
            showError(errorElement, 'Email is required.');
            return false;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showError(errorElement, 'Please enter a valid email address.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateSubject() {
        console.log('Validating subject...');

        if (!subjectSelect) {
            console.error('Subject select not found!');
            return false;
        }

        const subject = subjectSelect.value;
        const errorElement = document.getElementById('subject-error');

        if (subject === '') {
            showError(errorElement, 'Please select a subject.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateMessage() {
        console.log('Validating message...');

        if (!messageTextarea) {
            console.error('Message textarea not found!');
            return false;
        }

        const message = messageTextarea.value.trim();
        const errorElement = document.getElementById('message-error');

        if (message === '') {
            showError(errorElement, 'Message is required.');
            return false;
        }

        if (message.length < 10) {
            showError(errorElement, 'Message must be at least 10 characters.');
            return false;
        }

        if (message.length > 1000) {
            showError(errorElement, 'Message must be less than 1000 characters.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    // FUNCIONES DE AYUDA

    function saveFormData(formData) {
        const savedData = localStorage.getItem('contactSubmissions');
        const submissions = savedData ? JSON.parse(savedData) : [];

        submissions.unshift(formData);

        if (submissions.length > 50) {
            submissions.pop();
        }

        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        console.log('Form data saved to localStorage');
    }

    function showSuccessMessage() {
        console.log('Showing success message...');
        console.log('Success message element:', successMessage);

        if (successMessage) {
            successMessage.style.display = 'block';
            console.log('Success message displayed!');

            setTimeout(function () {
                successMessage.style.display = 'none';
                console.log('Success message hidden');
            }, 5000);
        } else {
            console.error('Success message element not found!');
        }

        showNotification('Thank you! Your message has been sent.', 'success');
    }

    function showError(element, message) {
        console.log('Showing error:', message);

        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            console.log('Error displayed in element');
        } else {
            console.error('Error element not found!');
        }
    }

    function hideError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }

    function clearAllErrors() {
        const allErrors = document.querySelectorAll('.error-message');
        console.log('Clearing errors, found:', allErrors.length);

        for (let i = 0; i < allErrors.length; i++) {
            allErrors[i].textContent = '';
            allErrors[i].style.display = 'none';
        }
    }

    function showNotification(message, type) {
        console.log('Showing notification:', message, type);

        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.textContent = message;

        document.body.appendChild(notification);
        console.log('Notification added to body');

        setTimeout(function () {
            if (notification.parentNode) {
                notification.remove();
                console.log('Notification removed');
            }
        }, 3000);
    }
}