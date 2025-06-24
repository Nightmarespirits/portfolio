/**
 * Contact Form Handling
 * Manages form validation, submission, and user feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  const formElements = {
    name: {
      element: document.getElementById('name'),
      errorElement: document.getElementById('name-errors'),
      helpElement: document.getElementById('name-help'),
      validate: (value) => {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!nameRegex.test(value)) return 'Por favor ingresa un nombre válido (solo letras y espacios)';
        return '';
      }
    },
    email: {
      element: document.getElementById('email'),
      errorElement: document.getElementById('email-errors'),
      helpElement: document.getElementById('email-help'),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!emailRegex.test(value)) return 'Por favor ingresa un correo electrónico válido';
        return '';
      }
    },
    message: {
      element: document.getElementById('message'),
      errorElement: document.getElementById('message-errors'),
      helpElement: document.getElementById('message-help'),
      validate: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return '';
      }
    }
  };
  
  const formErrors = document.getElementById('form-errors');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const btnText = submitButton.querySelector('.btn__text');
  const btnLoading = submitButton.querySelector('.btn__loading');
  
  // Initialize contact form
  initializeContactForm();
  
  /**
   * Initialize contact form with event listeners
   */
  function initializeContactForm() {
    // Add input event listeners for real-time validation
    Object.entries(formElements).forEach(([key, element]) => {
      element.addEventListener('input', () => validateField(key, element));
      element.addEventListener('blur', () => validateField(key, element, true));
    });
    
    // Add form submission handler
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  /**
   * Validate a form field
   * @param {string} fieldName - Name of the field to validate
   * @param {boolean} showError - Whether to show error messages
   * @returns {boolean} - Whether the field is valid
   */
  function validateField(fieldName, showError = false) {
    const field = formElements[fieldName];
    const element = field.element;
    const value = element.value.trim();
    const formGroup = element.closest('.form-group');
    
    // Reset field state
    formGroup.classList.remove('error', 'valid');
    
    // Validate field
    const errorMessage = field.validate(value);
    const isValid = !errorMessage;
    
    // Update field state
    if (showError) {
      if (isValid) {
        formGroup.classList.add('valid');
        field.errorElement.textContent = '';
        field.errorElement.setAttribute('aria-hidden', 'true');
        element.setAttribute('aria-invalid', 'false');
      } else {
        formGroup.classList.add('error');
        field.errorElement.textContent = errorMessage;
        field.errorElement.setAttribute('aria-hidden', 'false');
        element.setAttribute('aria-invalid', 'true');
        
        // Focus the first invalid field
        if (showError && !document.activeElement.isSameNode(element)) {
          element.focus();
        }
      }
    }
    
    return isValid;
  }
  
  /**
   * Validate all form fields
   * @returns {boolean} - Whether all fields are valid
   */
  function validateAllFields() {
    let isFormValid = true;
    
    Object.keys(formElements).forEach(fieldName => {
      if (!validateField(fieldName, true)) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Hide any previous form-level errors
    formErrors.hidden = true;
    
    // Validate all fields
    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      // Show form-level error message
      formErrors.hidden = false;
      formErrors.focus();
      
      // Focus the first invalid field
      const firstInvalidField = document.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      
      return;
    }
    
    // Prepare form data
    const formData = new FormData(contactForm);
    
    try {
      // Show loading state
      setFormLoadingState(true);
      
      // Simulate form submission (replace with actual fetch call)
      await simulateFormSubmission(formData);
      
      // Show success message
      showFormMessage('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
      
      // Reset form and validation states
      contactForm.reset();
      Object.keys(formElements).forEach(fieldName => {
        validateField(fieldName, true);
      });
      
      // Focus on the success message for screen readers
      const successMessage = document.querySelector('.form-message.success');
      if (successMessage) {
        successMessage.focus();
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showFormMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.', 'error');
      
      // Focus on the error message for screen readers
      const errorMessage = document.querySelector('.form-message.error');
      if (errorMessage) {
        errorMessage.focus();
      }
      
    } finally {
      // Reset button state
      setFormLoadingState(false);
    }
  }
  
  /**
   * Set the loading state of the form
   * @param {boolean} isLoading - Whether the form is in a loading state
   */
  function setFormLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.classList.add('btn--loading');
      btnText.setAttribute('aria-hidden', 'true');
      btnLoading.setAttribute('aria-hidden', 'false');
      
      // Disable all form elements during submission
      Object.values(formElements).forEach(field => {
        field.element.disabled = true;
      });
    } else {
      submitButton.disabled = false;
      submitButton.classList.remove('btn--loading');
      btnText.setAttribute('aria-hidden', 'false');
      btnLoading.setAttribute('aria-hidden', 'true');
      
      // Re-enable all form elements
      Object.values(formElements).forEach(field => {
        field.element.disabled = false;
      });
    }
  }
  
  /**
   * Simulate form submission (replace with actual fetch call)
   * @param {FormData} formData - Form data to submit
   * @returns {Promise} - A promise that resolves after a delay
   */
  function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
      // Convert form data to object (for potential submission)
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      
      // Simulate API call delay
      setTimeout(() => {
        // In a real implementation, you would use fetch() to send data to your server
        // Example:
        /*
        fetch('https://your-api-endpoint.com/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataObj)
        })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        */
        
        // For now, just resolve after a delay
        resolve();
      }, 1500);
    });
  }
  
  /**
   * Show a message to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of message ('success' or 'error')
   * @returns {HTMLElement} The created message element
   */
  function showFormMessage(message, type) {
    // Remove any existing messages of the same type
    const existingMessages = contactForm.querySelectorAll(`.form-message.${type}`);
    existingMessages.forEach(msg => msg.remove());
    
    // Create and show new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type} visible`;
    messageElement.setAttribute('role', 'alert');
    messageElement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    
    // Add an icon based on message type
    const icon = document.createElement('span');
    icon.className = 'message-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = type === 'success' ? '✓' : '!';
    
    // Add the message text
    const text = document.createElement('span');
    text.className = 'message-text';
    text.textContent = message;
    
    // Add close button for non-auto-dismissing messages
    if (type === 'error') {
      const closeButton = document.createElement('button');
      closeButton.className = 'message-close';
      closeButton.setAttribute('type', 'button');
      closeButton.setAttribute('aria-label', 'Cerrar mensaje');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        hideMessage(messageElement);
      });
      
      messageElement.append(icon, text, closeButton);
    } else {
      messageElement.append(icon, text);
    }
    
    // Insert message after the form title or at the beginning of the form
    const formTitle = contactForm.querySelector('h2, h3');
    if (formTitle && formTitle.nextElementSibling) {
      contactForm.insertBefore(messageElement, formTitle.nextElementSibling);
    } else {
      contactForm.prepend(messageElement);
    }
    
    // Add animation class after a short delay to trigger CSS animation
    setTimeout(() => {
      messageElement.classList.add('show');
    }, 10);
    
    // Focus the message for screen readers
    messageElement.focus();
    
    // Auto-hide success message after 8 seconds
    if (type === 'success') {
      setTimeout(() => {
        hideMessage(messageElement);
      }, 8000);
    }
    
    return messageElement;
  }
  
  /**
   * Hide a message with animation
   * @param {HTMLElement} messageElement - The message element to hide
   */
  function hideMessage(messageElement) {
    if (!messageElement) return;
    
    messageElement.classList.remove('show');
    
    // Remove the element after the animation completes
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }
});