#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainCLI_1 = require("./cli/MainCLI");
const AeronaveCLI_1 = require("./cli/AeronaveCLI");
const PecaCLI_1 = require("./cli/PecaCLI");
const FuncionarioCLI_1 = require("./cli/FuncionarioCLI");
const EtapaCLI_1 = require("./cli/EtapaCLI");
const TesteCLI_1 = require("./cli/TesteCLI");
console.log('Inicializando o Aerocode. . .');
try {
    AeronaveCLI_1.AeronaveCLI.carregar();
    PecaCLI_1.PecaCLI.carregarPecas();
    FuncionarioCLI_1.FuncionarioCLI.carregarFuncionarios();
    EtapaCLI_1.EtapaCLI.carregar();
    TesteCLI_1.TesteCLI.carregarTestes();
    console.log('Dados carregados!\n');
}
catch (error) {
    console.log('Iniciando com dados vazios...\n');
}
const salvarESair = () => {
    try {
        AeronaveCLI_1.AeronaveCLI.salvarAeronaves();
        PecaCLI_1.PecaCLI.salvarPecas();
        FuncionarioCLI_1.FuncionarioCLI.salvarFuncionarios();
        EtapaCLI_1.EtapaCLI.salvar();
        TesteCLI_1.TesteCLI.salvarTestes();
        console.log('Dados salvos!');
    }
    catch (error) {
        console.error('Erros:', error);
    }
    process.exit(0);
};
process.on('SIGINT', salvarESair);
process.on('SIGTERM', salvarESair);
MainCLI_1.MainCLI.show().catch((error) => {
    console.error('Erro:', error);
    salvarESair();
});
