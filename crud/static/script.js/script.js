const resultado = document.getElementById('resultado');
const input = document.getElementById('input');
const btn1 = document.getElementById('butao1');
const btn2 = document.getElementById('butao2');
const btn3 = document.getElementById('butao3');

let categoria = '';

function Enviar() {
    const value = input.value.trim();
    if (value.length < 6) {
        resultado.textContent = 'A categoria deve ter pelo menos 6 caracteres.';
        return;
    }
    
    categoria = value;

    fetch('/api/categoria', {
        method: categoria ? 'POST' : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoria })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        resultado.textContent = data.categoria || 'Categoria inexistente';
    })
    .catch(error => console.error('Erro: ', error));
}

btn1.addEventListener('click', Enviar);


function Ver() {
    fetch('/api/categoria')
    .then(response => response.json())
    .then(data => {
        categoria.value = '';
        resultado.textContent = data.categoria || 'Categoria inexistente'

    })
    .catch(error => console.error('erro: ',error))
}

btn2.addEventListener('click', Ver);

function Deletar() {
    fetch('/api/categoria')
    .then(() => {
        categoria.value = '';
        resultado.textContent = data.categoria || 'categoria deletada'
    })
    .catch(error => console.error('erro: ',error))
}

btn3.addEventListener('click', Deletar);