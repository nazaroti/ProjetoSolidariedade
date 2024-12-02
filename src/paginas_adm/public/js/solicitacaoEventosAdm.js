function showModal(event, action, eventId) {
    event.preventDefault(); // Evita comportamento padrão do link ou botão

    const modalTitle = document.getElementById('modal-title');
    const eventInput = document.getElementById('event_id');

    // Define o título e valor do campo oculto com base na ação
    if (action === "approve") {
        modalTitle.innerText = "Deseja Aprovar o Evento?";
        document.getElementById('confirm').value = "aprovado";
    } else if (action === "reject") {
        modalTitle.innerText = "Deseja Reprovar o Evento?";
        document.getElementById('confirm').value = "reprovado";
    } else if (action === "delete") {
        modalTitle.innerText = "Deseja EXCLUIR o Evento?";
        document.getElementById('confirm').value = "deletedo";
    }

    // Define o ID do evento
    eventInput.value = eventId;

    // Exibe os logs no console para depuração
    console.log("Event ID: " + eventId);
    console.log("Action: " + action);

    // Mostra o modal
    document.getElementById('modal').style.display = 'flex';
}

function closeModal(popup) {
    document.getElementById(popup).style.display = 'none';
    console.log("Modal fechado");
}

document.querySelectorAll(".modal-overlay").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
        // Verifica se o clique foi no overlay, fora do conteúdo do modal
        if (event.target === this) {
            closeModal('modal'); // Chama a função que fecha o modal
        }
    });
});
