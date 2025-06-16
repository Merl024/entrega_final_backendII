async function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value, 10);

    const res = await fetch(`/api/carts/user/add/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    if (data.status === 'success') {
        alert('Producto agregado al carrito');
        
        const stockCell = document.getElementById(`stock-${productId}`);
        if (stockCell) {
            let stock = parseInt(stockCell.textContent, 10);
            stockCell.textContent = stock - quantity;
            qtyInput.max = stock - quantity;
            if (stock - quantity <= 0) {
                qtyInput.disabled = true;
                const btn = stockCell.parentElement.querySelector('button');
                if (btn) btn.disabled = true;
            }
        }
    } else {
        alert(data.error || 'No se pudo agregar el producto');
    }
}