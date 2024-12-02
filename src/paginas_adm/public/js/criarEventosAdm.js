const form = document.getElementById('create-form');
const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('modal-create');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// Abrir o modal
openModalBtn.addEventListener('click', () => {
    // Verifica a validade dos campos do formulário
    if (form.checkValidity()) {
        modal.style.display = 'flex'; // Mostra o modal
    } else {
        // Exibe mensagens de erro padrão do navegador
        form.reportValidity();
    }
});

// Cancelar o envio (fechar o modal)
cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Esconde o modal
});

// Confirmar o envio do formulário
confirmBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Esconde o modal
    form.submit(); // Envia o formulário
});

// Fechar o modal clicando fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});