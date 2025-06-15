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