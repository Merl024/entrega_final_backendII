function openResetModal() {
    document.getElementById('resetModal').style.display = 'block';
}
function closeResetModal() {
    document.getElementById('resetModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetRequestForm');
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = this.email.value;
            const res = await fetch('/api/sessions/reset-password-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            document.getElementById('resetMsg').innerText = data.msg || data.error;
        });
    }
});