#!/usr/bin/env node

import { MainCLI } from "./cli/MainCLI";
import { AeronaveCLI } from "./cli/AeronaveCLI";
import { PecaCLI } from "./cli/PecaCLI";
import { FuncionarioCLI } from "./cli/FuncionarioCLI";
import { EtapaCLI } from "./cli/EtapaCLI";
import { TesteCLI } from "./cli/TesteCLI";

console.log('Inicializando o Aerocode. . .');
try {
    AeronaveCLI.carregar();
    PecaCLI.carregarPecas();
    FuncionarioCLI.carregarFuncionarios();
    EtapaCLI.cadastrarEtapa();
    TesteCLI.carregarTestes();
    console.log('Dados carregados!\n');
} catch (error) {
    console.log('Iniciando com dados vazios...\n');
}

const salvarESair = () => {
    try {
        AeronaveCLI.salvarAeronaves();
        PecaCLI.salvarPecas();
        FuncionarioCLI.salvarFuncionarios();
        EtapaCLI.salvar();
        TesteCLI.salvarTestes();
        console.log('Dados salvos!');
    } catch (error) {
        console.error('Erros:', error);
    }
    process.exit(0);
};

process.on('SIGINT', salvarESair);
process.on('SIGTERM', salvarESair);

MainCLI.show().catch((error) => {
    console.error('Erro:', error);
    salvarESair();
});