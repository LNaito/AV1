"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const AeronaveCLI_1 = require("./AeronaveCLI");
const PecaCLI_1 = require("./PecaCLI");
const EtapaCLI_1 = require("./EtapaCLI");
const TesteCLI_1 = require("./TesteCLI");
const RelatorioCLI_1 = require("./RelatorioCLI");
const FuncionarioCLI_1 = require("./FuncionarioCLI");
class MainCLI {
    static async show() {
        while (true) {
            const { opcao } = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'opcao',
                    message: 'Seja bem vindo ao Aerocode, escolha uma das opções abaixo:',
                    choices: [
                        'Gerenciar Aeronaves',
                        'Gerenciar Peças',
                        'Gerenciar Funcionários',
                        'Gerenciar Etapas de Produção',
                        'Gerenciar Testes',
                        'Gerar Relatórios',
                        'Sair'
                    ]
                }
            ]);
            switch (opcao) {
                case 'Gerenciar Aeronaves':
                    await AeronaveCLI_1.AeronaveCLI.show();
                    break;
                case 'Gerenciar Peças':
                    await PecaCLI_1.PecaCLI.show();
                    break;
                case 'Gerenciar Funcionários':
                    await FuncionarioCLI_1.FuncionarioCLI.show();
                    break;
                case 'Gerenciar Etapas de Produção':
                    await EtapaCLI_1.EtapaCLI.show();
                    break;
                case 'Gerenciar Testes':
                    await TesteCLI_1.TesteCLI.show();
                    break;
                case 'Gerar Relatórios':
                    await RelatorioCLI_1.RelatorioCLI.show();
                    break;
                case 'Sair':
                    console.log('👋 Obrigado por usar o Aerocode!');
                    return;
            }
        }
    }
}
exports.MainCLI = MainCLI;
