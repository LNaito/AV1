import inquirer from 'inquirer'
import { AeronaveCLI } from './AeronaveCLI';
import { PecaCLI } from './PecaCLI';
import { EtapaCLI } from './EtapaCLI';
import { TesteCLI } from './TesteCLI';
import { RelatorioCLI } from './RelatorioCLI';
import { FuncionarioCLI } from './FuncionarioCLI';

export class MainCLI {
    static async show(): Promise<void> {
        while(true) {
            const {opcao} = await inquirer.prompt([
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
            ])
            switch (opcao) {
                case 'Gerenciar Aeronaves':
                    await AeronaveCLI.show();
                    break;
                case 'Gerenciar Peças':
                    await PecaCLI.show();
                    break;
                case 'Gerenciar Funcionários':
                    await FuncionarioCLI.show();
                    break;
                case 'Gerenciar Etapas de Produção':
                    await EtapaCLI.EtapaShow();
                    break;
                case 'Gerenciar Testes':
                    await TesteCLI.show();
                    break;
                case 'Gerar Relatórios':
                    await RelatorioCLI.show();
                    break;
                case 'Sair':
                    console.log('Obrigado por usar o Aerocode!');
                    return;
            }
        }
    }
}