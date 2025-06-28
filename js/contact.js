document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  // Asegúrate de que el ID de tu botón de envío sea 'submit-btn' o ajústalo aquí
  const submitButton = form.querySelector('button[type="submit"]'); 
  const btnText = submitButton.querySelector('.btn__text');
  const btnLoading = submitButton.querySelector('.btn__loading');

  // Función para mostrar/ocultar el estado de carga
  const setButtonLoading = (isLoading) => {
      if (isLoading) {
          submitButton.disabled = true;
          if (btnText) btnText.style.display = 'none';
          if (btnLoading) btnLoading.style.display = 'inline-block';
      } else {
          submitButton.disabled = false;
          if (btnText) btnText.style.display = 'inline-block';
          if (btnLoading) btnLoading.style.display = 'none';
      }
  };

  form.addEventListener('submit', function (event) {
      // 1. Prevenimos el comportamiento por defecto (la redirección)
      event.preventDefault();

      // Creamos un objeto con los datos del formulario
      const formData = new FormData(this);

      // Mostramos el estado de carga
      setButtonLoading(true);

      // 2. Usamos fetch para enviar los datos en segundo plano
      fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
              // Esta cabecera es clave para que FormSubmit responda sin redireccionar
              'Accept': 'application/json'
          }
      })
      .then(response => {
          if (response.ok) {
              // 3. Si todo fue bien, mostramos éxito y reseteamos
              alert('¡Gracias! Tu mensaje ha sido enviado con éxito.');
              form.reset();
          } else {
              // Si FormSubmit devuelve un error
              throw new Error('Hubo un problema con el envío del formulario.');
          }
      })
      .catch(error => {
          // 4. Si hay un error de red o del servidor
          console.error('Error:', error);
          alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      })
      .finally(() => {
          // 5. En cualquier caso, restauramos el botón
          setButtonLoading(false);
      });
  });
});

