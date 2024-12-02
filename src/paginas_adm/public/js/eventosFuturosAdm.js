function showModal(event, action, eventId) {
    event.preventDefault(); // Evita comportamento padrão do link ou botão

    const modalTitle = document.getElementById('modal-title');
    const eventInput = document.getElementById('Event_id');

    // Define o título e valor do campo oculto com base na ação
    if (action === "delete") {
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

function showModalEdit(event, id, data) {
    event.preventDefault();
    
    const parsedData = JSON.parse(data);

    console.log("ID: " + data.ID_Evento);
    console.log("Nome " + data.Nome);

    document.getElementById('modal-title').textContent = "Editar Evento: " + parsedData.Nome;
    document.getElementById('event_ID').value = parsedData.ID_Evento;
    document.getElementById('event_name').value = parsedData.Nome;
    document.getElementById('event_description').value = parsedData.Descricao;
    document.getElementById('event_status').value = parsedData.Status;
    document.getElementById('event_date').value = parsedData.Data;
    document.getElementById('event_time').value = parsedData.Horario;
    document.getElementById('event_slots').value = parsedData.Num_Vagas;
    document.getElementById('event_location').value = parsedData.Local;
    document.getElementById('event_duration').value = parsedData.Duracao;
    document.getElementById('event_responsible').value = parsedData.Nome_Responsavel;

    
    document.getElementById('modal-edit').style.display = 'flex';
}

function closeModal(popup) {
    document.getElementById(popup).style.display = 'none';
    console.log("Modal fechado");
}

document.querySelectorAll(".modal-overlay").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
        // Verifica se o clique foi no overlay, fora do conteúdo do modal
        if (event.target === this) {
            const modalId = this.id;
            closeModal(modalId); // Chama a função que fecha o modal
        }
    });
});