// Contact form
export function initContactPage() {
    console.log('Start contact page...');

    // Form elements
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const successMessage = document.getElementById('success-message');

    // Submit form
    if (contactForm) {
        contactForm.addEventListener('submit', formSubmit);
    }

    // validate elements
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }

    if (messageTextarea) {
        messageTextarea.addEventListener('blur', validateMessage);
    }

    // Form submit
    function formSubmit(event) {
        event.preventDefault(); // Evitar que la página se recargue

        // Validate required elements
        const nameValid = validateName();
        const emailValid = validateEmail();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();

        // show error
        if (!nameValid || !emailValid || !subjectValid || !messageValid) {
            showNotification('Please fix the errors in the form.', 'error');
            return;
        }

        // Collect the data from the form
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectSelect.value,
            message: messageTextarea.value.trim(),
            submittedAt: new Date().toISOString()
        };

        // Save to localStorage
        saveFormData(formData);

        // Show success message
        showSuccessMessage();

        // Clear form
        contactForm.reset();
        clearAllErrors();
    }

    // Validations
    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('name-error');

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
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');

        if (email === '') {
            showError(errorElement, 'Email is required.');
            return false;
        }

        // Validate that email have @ and point
        if (!email.includes('@') || !email.includes('.')) {
            showError(errorElement, 'Please enter a valid email address.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateSubject() {
        const subject = subjectSelect.value;
        const errorElement = document.getElementById('subject-error');

        if (subject === '' || subject === null) {
            showError(errorElement, 'Please select a subject.');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateMessage() {
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

    // Save data to localStorage
    function saveFormData(formData) {
        // Get previous shipments
        const savedData = localStorage.getItem('contactSubmissions');
        const submissions = savedData ? JSON.parse(savedData) : [];

        // Add the new shipment to the beginning
        submissions.unshift(formData);

        // Limit to 50 shipments
        if (submissions.length > 50) {
            submissions.pop();
        }

        // Save again
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        console.log('Form submitted:', formData);
    }

    // Show success message
    function showSuccessMessage() {
        if (successMessage) {
            successMessage.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(function () {
                successMessage.style.display = 'none';
            }, 5000);
        }

        showNotification('Thank you! Your message has been sent.', 'success');
    }

    //Show error in a field
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    // Hide error in a field
    function hideError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }

    // Clear all errors
    function clearAllErrors() {
        const allErrors = document.querySelectorAll('.error-message');
        for (let i = 0; i < allErrors.length; i++) {
            allErrors[i].textContent = '';
            allErrors[i].style.display = 'none';
        }
    }

    // Show notification on screen
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // RRemove after 3 seconds
        setTimeout(function () {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}