import inquirer from "inquirer";
import Relatorio from "../Relatorio";
import { AeronaveCLI } from "./AeronaveCLI";
import { PecaCLI } from "./PecaCLI";
import { EtapaCLI } from "./EtapaCLI";
import { TesteCLI } from "./TesteCLI";

export class RelatorioCLI {
    static async show(): Promise<void> {
        const { acao } = await inquirer.prompt([
            {
                type: 'list',
                name: 'acao',
                message: '== Gerenciar Relatórios',
                choices: [
                    '1 - Gerar Relatório por Aeronave',
                    '2 - Gerar Relatório Completo',
                    '3 - Listar Relatórios',
                    '0 - Sair'
                ]
            }
        ]);

        switch (acao) {
            case '1':
                await this.gerarRelatorioA();
                break;
            case '2':
                await this.gerarRelatorioSistema();
                break;
            case '3':
                await this.listarRelatoriosSalvos();
                break;
            case '0':
                break;
        }
    }

    static async gerarRelatorioA(): Promise<void> {
        if (AeronaveCLI['listaAeronaves'].length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }

        console.log('\n == Aeronaves listadas:');
        AeronaveCLI['listaAeronaves'].forEach((aeronave: any, index: number) => {
            console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipo})`);
        });

        const dados = await inquirer.prompt([
            { 
                type: 'input', 
                name: 'codigoAeronave', 
                message: 'Digite o código da aeronave: ',
                validate: (input: string) => {
                    if (!input.trim()) return 'Por favor, insira um código válido.';
                    
                    const aeronave = AeronaveCLI['listaAeronaves'].find((a: any) => a.codigo === input);
                    if (!aeronave) return 'Aeronave não encontrada!';
                    
                    return true;
                }
            },
            { 
                type: 'input', 
                name: 'nomeCliente', 
                message: 'Nome do cliente: ',
                validate: (input: string) => {
                    if (!input.trim()) return 'Por favor, insira o nome do Cliente.';
                    return true;
                }
            },
            { 
                type: 'input', 
                name: 'dataEntrega', 
                message: 'Data de entrega: ',
                validate: (input: string) => {
                    if (!input.trim()) return 'A data é obrigatória!';
                    return true;
                }
            }
        ]);

        const aeronave = AeronaveCLI['listaAeronaves'].find((a: any) => a.codigo === dados.codigoAeronave);
        
        if (!aeronave) {
            console.log(' Aeronave não encontrada!');
            return;
        }

        const relatorio = new Relatorio(
            aeronave,
            dados.nomeCliente,
            new Date(dados.dataEntrega)
        );

        console.log('\n Seu Relatório:');
        console.log(relatorio.gerarRelatorio());
        
        const { salvar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'salvar',
                message: 'Deseja salvar o relatório em arquivo?',
                default: true
            }
        ]);

        if (salvar) {
            relatorio.salvarRelatorio();
        }
    }

    static async gerarRelatorioSistema(): Promise<void> {
        console.log('\n == RELATÓRIO FINAL ==');
        console.log('== Informações gerais da Aerocode:');
        console.log(`   Total de Aeronaves: ${AeronaveCLI['listaAeronaves'].length}`);
        console.log(`   Total de Peças: ${PecaCLI['pecas']?.length || 0}`);
        console.log(`   Total de Etapas: ${EtapaCLI['etapas']?.length || 0}`);
        console.log(`   Total de Testes: ${TesteCLI['testes']?.length || 0}`);
        console.log('\nRelatório do sistema gerado com sucesso!');

        const { salvar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'salvar',
                message: 'Deseja salvar este relatório do sistema em arquivo?',
                default: false
            }
        ]);

        if (salvar) {
            this.salvarRelatorioSistema();
        }
    }

    static async listarRelatoriosSalvos(): Promise<void> {
        const fs = await import('fs');
        const path = await import('path');

        const relatoriosDir = 'data';
        
        if (!fs.existsSync(relatoriosDir)) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }

        const arquivos = fs.readdirSync(relatoriosDir)
            .filter(arquivo => arquivo.startsWith('relatorio_') && arquivo.endsWith('.txt'));

        if (arquivos.length === 0) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }

        console.log('\n📁 RELATÓRIOS SALVOS:');
        arquivos.forEach((arquivo, index) => {
            console.log(`${index + 1}. ${arquivo}`);
        });

        const { visualizar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'visualizar',
                message: 'Deseja visualizar algum relatório?',
                default: false
            }
        ]);

        if (visualizar) {
            const { arquivoSelecionado } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'arquivoSelecionado',
                    message: 'Selecione o relatório para visualizar:',
                    choices: arquivos
                }
            ]);

            const conteudo = fs.readFileSync(path.join(relatoriosDir, arquivoSelecionado), 'utf8');
            console.log(`\n📄 CONTEÚDO DO RELATÓRIO ${arquivoSelecionado}:`);
            console.log('================================');
            console.log(conteudo);
        }
    }

    static salvarRelatorioSistema(): void {
        const fs = require('fs');
        const path = require('path');

        try {
            const dataDir = 'data';
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const nomeArquivo = `relatorio_sistema_${timestamp}.txt`;
            
            let relatorioTexto = '== Relatório completo: \n';
            
            // Aqui você reconstruiria todo o relatório em formato de texto
            relatorioTexto += `Data de geração: ${new Date().toLocaleString()}\n\n`;
            relatorioTexto += `Total de Aeronaves: ${AeronaveCLI['listaAeronaves'].length}\n`;
            relatorioTexto += `Total de Peças: ${PecaCLI['pecas']?.length || 0}\n`;
            relatorioTexto += `Total de Etapas: ${EtapaCLI['etapas']?.length || 0}\n`;
            relatorioTexto += `Total de Testes: ${TesteCLI['testes']?.length || 0}\n`;

            fs.writeFileSync(path.join(dataDir, nomeArquivo), relatorioTexto);
            console.log(`Relatório do sistema salvo em: data/${nomeArquivo}`);
        } 
        
        catch (error) {
            console.error('Erro:', error);
        }
    }
}