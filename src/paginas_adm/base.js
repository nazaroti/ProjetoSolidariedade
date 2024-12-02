// #region Declarações de variáveis de controle

// Importações e Configuração Inicial
const express = require("express");
const { Op } = require("sequelize");
const { engine } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const flash = require('connect-flash');

// Instância do Express
const app = express();

// Middleware para flash messages
app.use(flash());

// Defina o mecanismo de visualização (exemplo: EJS)
app.set('view engine', 'ejs');

// Middleware para permitir métodos PUT e DELETE em formulários HTML
app.use(methodOverride('_method'));

// Modelos
const database = require("./models/db");
const EventModel = require("./models/Event");
const ParticipantModel = require("./models/Participant");
const UserModel = require("./models/User");

// Definindo a associação entre os modelos
UserModel.hasMany(ParticipantModel, {
    foreignKey: 'ID_Usuario',
    as: 'participants',
});

ParticipantModel.belongsTo(UserModel, {
    foreignKey: 'ID_Usuario',
    as: 'user',
});
// #endregion

// #region Configuração Handlebars
app.engine("handlebars", engine({
    defaultLayout: "main",
    helpers: {
        Equals: function (a, b) {
            return a != b;
        },
        reverseDate: function (date) {
            const parts = date.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        },
        removeSeconds: function (time) {
            return time.slice(0, 5);
        },
        json: function (context) {
            return JSON.stringify(context);
        }
    }
}));

app.set('view engine', 'handlebars');
// #endregion

// Configuração para utilizar elementos estáticos
app.use(express.static(path.join(__dirname, "public")));

// #region Configuração Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// #endregion

// #region Autentificador de conexão do Banco de Dados
database.sequelize.authenticate().then(function () {
    console.log("Banco de Dados Conectado com Sucesso!");
}).catch(function () {
    console.log("Erro ao conectar.");
});
// #endregion

app.use(express.json()); 

// #region Rotas

// #region Rotas GET

// Rota Principal
app.get("/solicitacoes", async function (req, res) {
    try {
        const dataAtual = new Date();
        const data = dataAtual.toLocaleDateString('en-CA');
        const horario = dataAtual.toTimeString().slice(0, 8);

        const eventsInReview = await EventModel.findAll({
            where: {
                Status: 'em analise',
                [Op.or]: [
                    { Data: { [Op.gt]: data } },
                    {
                        Data: data,
                        Horario: { [Op.gt]: horario }
                    }
                ]
            },
            order: [['Data', 'ASC']]
        });
        res.render('solicitacaoEventosAdm', {
            eventsInReview: eventsInReview.map(EventModel => EventModel.dataValues)
        });
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        res.status(500).send("Erro ao carregar eventos.");
    }
});

app.get("/eventos-futuros", async function (req, res) {
    try {
        const dataAtual = new Date();
        const data = dataAtual.toLocaleDateString('en-CA');
        const horario = dataAtual.toTimeString().slice(0, 8);

        const upcomingEvents = await EventModel.findAll({
            where: {
                Status: "aprovado",
                [Op.or]: [
                    { Data: { [Op.gt]: data } },

                    {
                        Data: data,
                        Horario: { [Op.gt]: horario }
                    }
                ]
            },
            order: [['Data', 'ASC']]
        });
        res.render('eventosFuturosAdm', {
            upcomingEvents: upcomingEvents.map(EventModel => EventModel.dataValues)
        });
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        res.status(500).send("Erro ao carregar eventos.");
    }
});

app.get("/criar-eventos", async function (req, res) {
    try {
        res.render('criarEventosAdm');
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        res.status(500).send("Erro ao carregar eventos.");
    }
});

app.get("/relatorio-eventos", async function (req, res) {
    try {
        const dataAtual = new Date();
        const dataLimite = new Date(dataAtual);
        dataLimite.setDate(dataAtual.getDate() - 30);
        const data = dataAtual.toLocaleDateString('en-CA');
        const horario = dataAtual.toTimeString().slice(0, 8);
        const dataLimiteFormatada = dataLimite.toLocaleDateString('en-CA');

        const eventReports = await EventModel.findAll({
            where: {
                Status: { [Op.ne]: "em análise" },
                Data: { [Op.gte]: dataLimiteFormatada }
            },
            order: [['Data', 'ASC']]
        });

        res.render('relatorioEventosAdm', {
            eventReports: eventReports.map(EventModel => EventModel.dataValues)
        });
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        res.status(500).send("Erro ao carregar eventos.");
    }
})

// #endregion

// #region Rotas POST
app.post("/viewParticipants", async (req, res) => {
    try {
        const { id_event } = req.body;

        console.log("ID Evento: " + id_event);

        const participants = await ParticipantModel.findAll({
            where: {
                ID_Evento: id_event
            },
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['nome'],
                }
            ],
        });

        console.log("Participantes encontrados:", participants);

        if (participants && participants.length > 0) {
            const userNames = participants.map(participant => {
                if (participant.user) {
                    return participant.user.nome;
                } else {
                    console.log("Erro: usuário não encontrado para este participante");
                    return null;
                } 11
            }).filter(nome => nome !== null);

            console.log(userNames);
        } else {
            console.log("Nenhum participante encontrado para o evento");
        }

        if (participants.length > 0) {
            const userNames = participants
                .map(participant => participant.user ? participant.user.nome : null)
                .filter(nome => nome !== null);

            res.json({ userNames });
        } else {
            res.json({ userNames: [] });
        }

    } catch (error) {
        console.error('Erro ao buscar participantes: ', error);
        res.status(500).send('Erro ao buscar participantes.');
    }
});




app.delete("/deleteEvent", async (req, res) => {
    try {
        const { event_id } = req.body;

        console.log("ID Evento: " + event_id);

        // Deleta o evento com o ID fornecido
        const deletedRows = await EventModel.destroy({
            where: { ID_Evento: event_id }
        });

        if (deletedRows > 0) {
            console.log("Evento deletado com sucesso!");
            res.redirect("/eventos-futuros")
        } else {
            console.log("Evento não encontrado.");
            res.status(404).send("Evento não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao deletar o evento:", error);
        res.status(500).send("Erro ao processar a solicitação.");
    }
});


app.put("/updateEventStatus", async (req, res) => {
    try {
        const { event_id, confirm } = req.body;

        console.log("ID Evento: " + event_id);
        console.log("Novo Status: " + confirm);

        // Atualiza o status do evento com o ID fornecido
        const [updatedRows] = await EventModel.update(
            { Status: confirm }, // Atualiza o campo `Status`
            { where: { ID_Evento: event_id } }
        );

        if (updatedRows > 0) {
            console.log(`Registros atualizados: ${updatedRows}`);
            res.redirect("/solicitacoes");
        } else {
            console.log("Evento não encontrado.");
            res.status(404).send("Evento não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao atualizar o status do evento:", error);
        res.status(500).send("Erro ao processar a solicitação.");
    }
});


app.put("/editData", async (req, res) => {
    try {
        const {
            event_ID,
            event_name,
            event_description,
            event_status,
            event_date,
            event_time,
            event_slots,
            event_location,
            event_duration,
            event_responsible
        } = req.body;

        const [updatedRows] = await EventModel.update(
            {
                Nome: event_name,
                Descricao: event_description,
                Status: event_status,
                Data: event_date,
                Horario: event_time,
                Num__Vagas: event_slots,
                Local: event_location,
                Duracao: event_duration,
                Nome_Responsavel: event_responsible
            },
            {
                where: { ID_Evento: event_ID }
            });
        console.log(`Registros atualizados: ${updatedRows}`);
        res.redirect("/eventos-futuros");
    } catch (error) {
        console.error("Erro ao processar os dados:", error);
        res.status(500).send("Erro ao processar a solicitação.");
    }
});

app.post("/createData", async (req, res) => {
    try {
        const {
            event_name,
            event_description,
            event_date,
            event_time,
            event_slots,
            event_location,
            event_duration,
            event_responsible
        } = req.body;

        // Criação do evento no banco
        const event = await EventModel.create({
            Nome: event_name,
            Descricao: event_description,
            Status: 'aprovado',
            Data: event_date,
            Horario: event_time,
            Num__Vagas: event_slots,
            Local: event_location,
            Duracao: event_duration,
            Nome_Responsavel: event_responsible
        });

        console.log(`Evento criado com ID: ${event.id}`);

        res.redirect("/eventos-futuros");
    } catch (error) {
        console.error("Erro ao processar os dados:", error);
        res.status(500).send("Erro ao processar a solicitação.");
    }
});



// #endregion

app.listen(8081, function () {
    console.log("Servidor Rodando...");
});






