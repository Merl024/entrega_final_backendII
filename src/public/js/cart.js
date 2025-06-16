// Eliminar producto del carrito
function deleteProductFromCart(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Producto eliminado del carrito');
            window.location.reload();
        } else {
            alert(data.error || 'No se pudo eliminar el producto');
        }
    })
    .catch(() => alert('Error al eliminar el producto'));
}

// Finalizar compra y generar ticket
document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', async function() {
            const cartId = this.getAttribute('data-cartid');
            const res = await fetch(`/api/carts/${cartId}/purchase`, { method: 'POST' });
            const data = await res.json();
            const resultDiv = document.getElementById('ticketResult');
            if (data.status === 'success') {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>¡Compra realizada!</h4>
                        <p>ID de Ticket: <b>${data.ticket.code}</b></p>
                        <p>Total: <b>$${data.ticket.amount}</b></p>
                        <p>Se ha enviado la factura a tu correo.</p>
                    </div>
                `;
                
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Ticket generado y enviado a tu email!',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                resultDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'No se pudo completar la compra.'}</div>`;
            }
        });
    }
});