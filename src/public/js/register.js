const form = document.getElementById('registerForm')


form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        age: this.age.value,
        password: this.password.value
    };

    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.status === 201) {
        // Registro exitoso, redirige al login
        window.location.href = '/users/login';
    } else {
        alert(result.msg || 'No se pudo crear el usuario!');
    }
});

