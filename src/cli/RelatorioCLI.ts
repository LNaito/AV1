import inquirer from "inquirer";
import Relatorio from "../Relatorio";
import { AeronaveCLI } from "./AeronaveCLI";
import { PecaCLI } from "./PecaCLI";
import { EtapaCLI } from "./EtapaCLI";
import { TesteCLI } from "./TesteCLI";
import fs from 'fs';
import path from 'path';

export class RelatorioCLI {
    static async gerarRelatorioA(): Promise<void> {
        if (AeronaveCLI['listaAeronaves'].length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }

        console.log('\n== Aeronaves disponíveis:');
        AeronaveCLI['listaAeronaves'].forEach((aeronave: any, index: number) => {
            console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipoA})`);
        });

        const dados = await inquirer.prompt([
            { type: 'input', name: 'codigoAeronave', message: 'Digite o código da aeronave:' },
            { type: 'input', name: 'nomeCliente', message: 'Nome do cliente:' },
            { type: 'input', name: 'dataEntrega', message: 'Data de entrega:' }
        ]);

        const aeronave = AeronaveCLI['listaAeronaves'].find((a: any) => a.codigo === dados.codigoAeronave);
        if (!aeronave) {
            console.log('Aeronave não encontrada!');
            return;
        }

        const relatorio = new Relatorio(aeronave, dados.nomeCliente, new Date(dados.dataEntrega));
        console.log('\n== Seu Relatório ==');
        console.log(relatorio.gerarRelatorio());

        const { salvar } = await inquirer.prompt([{ type: 'confirm', name: 'salvar', message: 'Deseja salvar o relatório em arquivo?', default: true }]);
        if (salvar) relatorio.salvarRelatorio();
    }

    static async gerarRelatorioSistema(): Promise<void> {
        console.log('\n== RELATÓRIO FINAL ==');
        console.log(`Total de Aeronaves: ${AeronaveCLI['listaAeronaves'].length}`);
        console.log(`Total de Peças: ${PecaCLI['pecas']?.length || 0}`);
        console.log(`Total de Etapas: ${EtapaCLI['etapas']?.length || 0}`);
        console.log(`Total de Testes: ${TesteCLI['testes']?.length || 0}`);

        const { salvar } = await inquirer.prompt([{ type: 'confirm', name: 'salvar', message: 'Deseja salvar este relatório do sistema em arquivo?', default: false }]);
        if (salvar) this.salvarRelatorioSistema();
    }

    static salvarRelatorioSistema(): void {
        try {
            const dataDir = 'data';
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const nomeArquivo = `relatorio_sistema_${timestamp}.txt`;

            let relatorioTexto = '== Relatório completo ==\n';
            relatorioTexto += `Data de geração: ${new Date().toLocaleString()}\n\n`;
            relatorioTexto += `Total de Aeronaves: ${AeronaveCLI['listaAeronaves'].length}\n`;
            relatorioTexto += `Total de Peças: ${PecaCLI['pecas']?.length || 0}\n`;
            relatorioTexto += `Total de Etapas: ${EtapaCLI['etapas']?.length || 0}\n`;
            relatorioTexto += `Total de Testes: ${TesteCLI['testes']?.length || 0}\n`;

            fs.writeFileSync(path.join(dataDir, nomeArquivo), relatorioTexto);
            console.log(`Relatório do sistema salvo em: data/${nomeArquivo}`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static async listarRelatoriosSalvos(): Promise<void> {
        const relatoriosDir = 'data';
        if (!fs.existsSync(relatoriosDir)) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }

        const arquivos = fs.readdirSync(relatoriosDir).filter(f => f.startsWith('relatorio_') && f.endsWith('.txt'));
        if (arquivos.length === 0) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }

        console.log('\n📁 RELATÓRIOS SALVOS:');
        arquivos.forEach((arquivo, index) => console.log(`${index + 1}. ${arquivo}`));

        const { visualizar } = await inquirer.prompt([{ type: 'confirm', name: 'visualizar', message: 'Deseja visualizar algum relatório?', default: false }]);
        if (visualizar) {
            const { arquivoSelecionado } = await inquirer.prompt([{
                type: 'list',
                name: 'arquivoSelecionado',
                message: 'Selecione o relatório para visualizar:',
                choices: arquivos
            }]);

            const conteudo = fs.readFileSync(path.join(relatoriosDir, arquivoSelecionado), 'utf8');
            console.log(`\n📄 CONTEÚDO DO RELATÓRIO ${arquivoSelecionado}:\n`);
            console.log(conteudo);
        }
    }

    static async show(): Promise<void> {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer.prompt([{
                type: 'list',
                name: 'acao',
                message: '== Menu Relatórios ==',
                choices: [
                    'Gerar Relatório por Aeronave',
                    'Gerar Relatório Completo',
                    'Listar Relatórios',
                    'Voltar'
                ]
            }]);

            switch (acao) {
                case 'Gerar Relatório por Aeronave': await this.gerarRelatorioA(); break;
                case 'Gerar Relatório Completo': await this.gerarRelatorioSistema(); break;
                case 'Listar Relatórios': await this.listarRelatoriosSalvos(); break;
                case 'Voltar': sair = true; break;
            }
        }
    }
}
