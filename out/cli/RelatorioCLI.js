"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Relatorio_1 = __importDefault(require("../Relatorio"));
const AeronaveCLI_1 = require("./AeronaveCLI");
const PecaCLI_1 = require("./PecaCLI");
const EtapaCLI_1 = require("./EtapaCLI");
const TesteCLI_1 = require("./TesteCLI");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class RelatorioCLI {
    static async gerarRelatorioA() {
        if (AeronaveCLI_1.AeronaveCLI['listaAeronaves'].length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }
        console.log('\n== Aeronaves disponíveis:');
        AeronaveCLI_1.AeronaveCLI['listaAeronaves'].forEach((aeronave, index) => {
            console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipoA})`);
        });
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'codigoAeronave', message: 'Digite o código da aeronave:' },
            { type: 'input', name: 'nomeCliente', message: 'Nome do cliente:' },
            { type: 'input', name: 'dataEntrega', message: 'Data de entrega:' }
        ]);
        const aeronave = AeronaveCLI_1.AeronaveCLI['listaAeronaves'].find((a) => a.codigo === dados.codigoAeronave);
        if (!aeronave) {
            console.log('Aeronave não encontrada!');
            return;
        }
        const relatorio = new Relatorio_1.default(aeronave, dados.nomeCliente, new Date(dados.dataEntrega));
        console.log('\n== Seu Relatório ==');
        console.log(relatorio.gerarRelatorio());
        const { salvar } = await inquirer_1.default.prompt([{ type: 'confirm', name: 'salvar', message: 'Deseja salvar o relatório em arquivo?', default: true }]);
        if (salvar)
            relatorio.salvarRelatorio();
    }
    static async gerarRelatorioSistema() {
        console.log('\n== RELATÓRIO FINAL ==');
        console.log(`Total de Aeronaves: ${AeronaveCLI_1.AeronaveCLI['listaAeronaves'].length}`);
        console.log(`Total de Peças: ${PecaCLI_1.PecaCLI['pecas']?.length || 0}`);
        console.log(`Total de Etapas: ${EtapaCLI_1.EtapaCLI['etapas']?.length || 0}`);
        console.log(`Total de Testes: ${TesteCLI_1.TesteCLI['testes']?.length || 0}`);
        const { salvar } = await inquirer_1.default.prompt([{ type: 'confirm', name: 'salvar', message: 'Deseja salvar este relatório do sistema em arquivo?', default: false }]);
        if (salvar)
            this.salvarRelatorioSistema();
    }
    static salvarRelatorioSistema() {
        try {
            const dataDir = 'data';
            if (!fs_1.default.existsSync(dataDir))
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const nomeArquivo = `relatorio_sistema_${timestamp}.txt`;
            let relatorioTexto = '== Relatório completo ==\n';
            relatorioTexto += `Data de geração: ${new Date().toLocaleString()}\n\n`;
            relatorioTexto += `Total de Aeronaves: ${AeronaveCLI_1.AeronaveCLI['listaAeronaves'].length}\n`;
            relatorioTexto += `Total de Peças: ${PecaCLI_1.PecaCLI['pecas']?.length || 0}\n`;
            relatorioTexto += `Total de Etapas: ${EtapaCLI_1.EtapaCLI['etapas']?.length || 0}\n`;
            relatorioTexto += `Total de Testes: ${TesteCLI_1.TesteCLI['testes']?.length || 0}\n`;
            fs_1.default.writeFileSync(path_1.default.join(dataDir, nomeArquivo), relatorioTexto);
            console.log(`Relatório do sistema salvo em: data/${nomeArquivo}`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    static async listarRelatoriosSalvos() {
        const relatoriosDir = 'data';
        if (!fs_1.default.existsSync(relatoriosDir)) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }
        const arquivos = fs_1.default.readdirSync(relatoriosDir).filter(f => f.startsWith('relatorio_') && f.endsWith('.txt'));
        if (arquivos.length === 0) {
            console.log('📭 Nenhum relatório salvo encontrado.');
            return;
        }
        console.log('\n📁 RELATÓRIOS SALVOS:');
        arquivos.forEach((arquivo, index) => console.log(`${index + 1}. ${arquivo}`));
        const { visualizar } = await inquirer_1.default.prompt([{ type: 'confirm', name: 'visualizar', message: 'Deseja visualizar algum relatório?', default: false }]);
        if (visualizar) {
            const { arquivoSelecionado } = await inquirer_1.default.prompt([{
                    type: 'list',
                    name: 'arquivoSelecionado',
                    message: 'Selecione o relatório para visualizar:',
                    choices: arquivos
                }]);
            const conteudo = fs_1.default.readFileSync(path_1.default.join(relatoriosDir, arquivoSelecionado), 'utf8');
            console.log(`\n📄 CONTEÚDO DO RELATÓRIO ${arquivoSelecionado}:\n`);
            console.log(conteudo);
        }
    }
    static async show() {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer_1.default.prompt([{
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
                case 'Gerar Relatório por Aeronave':
                    await this.gerarRelatorioA();
                    break;
                case 'Gerar Relatório Completo':
                    await this.gerarRelatorioSistema();
                    break;
                case 'Listar Relatórios':
                    await this.listarRelatoriosSalvos();
                    break;
                case 'Voltar':
                    sair = true;
                    break;
            }
        }
    }
}
exports.RelatorioCLI = RelatorioCLI;
