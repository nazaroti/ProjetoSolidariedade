CREATE DATABASE BDong;
USE BDong;

-- Tabela de Usuários
CREATE TABLE Usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  telefone VARCHAR(15),
  email VARCHAR(100),
  senha VARCHAR(255) -- Aumentei o tamanho para 255
);

-- Tabela de Eventos
CREATE TABLE Evento(
    ID_Evento INT AUTO_INCREMENT PRIMARY KEY,
    ID_Usuario INT,
    Nome VARCHAR(100),
    Descricao VARCHAR(300),
    Status VARCHAR(30),
    Data DATE NOT NULL,
    Horario TIME,
    Num_Vagas INT,
    Local VARCHAR(150),
    Duracao TIME,
    Nome_Responsavel VARCHAR(100), 
    FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(id) -- Corrigi o nome da chave estrangeira
);

-- Tabela de Inscrições em Eventos
CREATE TABLE Inscrever_Evento(
    ID_Inscricao INT AUTO_INCREMENT PRIMARY KEY,
    ID_Evento INT NOT NULL,
    ID_Usuario INT NOT NULL,
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento),
    FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(id) -- Corrigi o nome da chave estrangeira
);

-- Tabela de Administradores
CREATE TABLE Adm(
    ID_Adm INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100),
    Email VARCHAR(50),
    Senha VARCHAR(255) -- Aumentei o tamanho para 255
);

-- Tabela de Calendário
CREATE TABLE Calendario(
    ID_Calendario INT AUTO_INCREMENT PRIMARY KEY,
    ID_Evento_Agendado INT,
    Data DATE NOT NULL,
    Horario TIME,
    FOREIGN KEY (ID_Evento_Agendado) REFERENCES Evento(ID_Evento) -- Chave estrangeira adicionada
);



