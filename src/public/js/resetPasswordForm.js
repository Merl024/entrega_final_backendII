document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const password = this.password.value;
            const token = this.token.value;
            const res = await fetch('/api/sessions/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            const data = await res.json();
            document.getElementById('resetResult').innerText = data.msg || data.error;
            if (data.status === 'success') setTimeout(() => window.location = '/users/login', 2000);
        });
    }
});