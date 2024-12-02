function showModal(event, id, data) {
    event.preventDefault();

    const parsedData = JSON.parse(data);

    console.log("ID: " + parsedData.ID_Evento);
    console.log("Nome: " + parsedData.Nome);

    document.getElementById('modal-title').textContent = parsedData.Nome;
    document.getElementById('event_id').value = parsedData.ID_Evento;
    document.getElementById('event_description').textContent = parsedData.Descricao;
    document.getElementById('event_date').textContent = parsedData.Data;
    document.getElementById('event_time').textContent = parsedData.Horario;
    document.getElementById('event_slots').textContent = parsedData.Num_Vagas;
    document.getElementById('event_location').textContent = parsedData.Local;
    document.getElementById('event_duration').textContent = parsedData.Duracao;
    document.getElementById('event_responsible').textContent = parsedData.Nome_Responsavel;
    document.getElementById('event_status').textContent = parsedData.Status || "Status não disponível"; // Se o status não estiver disponível, usa uma mensagem padrão

    document.getElementById('modal').style.display = 'flex';
}
function openModal(participants) {
    const modal = document.getElementById("modal-participant");
    const participantList = document.getElementById("participantList");

    participantList.innerHTML = '';

    participants.forEach(nome => {
        const listItem = document.createElement('li');
        listItem.textContent = nome;
        participantList.appendChild(listItem);
    });

    modal.style.display = "block"; 
}


function closeModal(modal) {
    document.getElementById(modal).style.display = 'none';
}

document.querySelectorAll(".modal-overlay").forEach(function (modal) {
    modal.addEventListener("click", function (event) {

        if (event.target === this) {
            closeModal('modal');
        }
    });
});
