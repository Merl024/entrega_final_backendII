const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {

            result.json()
                .then(json => {
                    console.log("Cookies generadas:");
                    console.log(document.cookie);
                    alert("Login realizado con exito!!")
                    if(json.role === 'admin'){
                        window.location.replace('/users/admin')
                    } else{
                        window.location.replace('/users')
                    }
                });
        } else if (result.status === 401) {
            console.log(result);
            alert("Login invalido!!")
        }
    })
})