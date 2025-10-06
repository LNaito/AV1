"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesteCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Teste_1 = __importDefault(require("../Teste"));
const enum_1 = require("../enum");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TesteCLI {
    static salvarTestes() {
        try {
            const dataDir = path_1.default.dirname(this.DATA_FILE);
            if (!fs_1.default.existsSync(dataDir))
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            const dadosSerializaveis = this.testes.map(teste => ({
                tipo: teste.tipoT,
                resultado: teste.resultado
            }));
            fs_1.default.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`✅ ${this.testes.length} teste(s) salvo(s) com sucesso em ${this.DATA_FILE}!`);
        }
        catch (error) {
            console.error('❌ Erro ao salvar testes:', error);
        }
    }
    static carregarTestes() {
        try {
            if (!fs_1.default.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de testes encontrado. Iniciando com lista vazia.');
                return;
            }
            const dados = JSON.parse(fs_1.default.readFileSync(this.DATA_FILE, 'utf8'));
            this.testes = dados.map((dado) => new Teste_1.default(dado.tipo, dado.resultado));
            console.log(`✅ ${this.testes.length} teste(s) carregado(s) com sucesso!`);
        }
        catch (error) {
            console.error('❌ Erro ao carregar testes:', error);
        }
    }
    static async cadastrarTeste() {
        const dados = await inquirer_1.default.prompt([
            { type: 'list', name: 'tipo', message: 'Qual o tipo do teste? ', choices: Object.values(enum_1.TipoTeste) },
            { type: 'list', name: 'resultado', message: 'Qual o resultado do teste? ', choices: Object.values(enum_1.ResultadoTeste) }
        ]);
        const teste = new Teste_1.default(dados.tipo, dados.resultado);
        this.testes.push(teste);
        console.log('Teste cadastrado com sucesso!');
    }
    static async listarTestes() {
        if (this.testes.length === 0) {
            console.log('Nenhum teste cadastrado.');
            return;
        }
        console.log('\n== LISTA DE TESTES ==');
        this.testes.forEach((teste, index) => {
            console.log(`${index + 1}. ${teste.tipoT} - Resultado: ${teste.resultado}`);
        });
    }
    static async executarTeste() {
        if (this.testes.length === 0) {
            console.log('Nenhum teste disponível para executar.');
            return;
        }
        const { indice } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'indice',
                message: 'Selecione o teste para executar:',
                choices: this.testes.map((teste, index) => ({ name: `${teste.tipoT} - ${teste.resultado}`, value: index }))
            }]);
        const testeSelecionado = this.testes[indice];
        testeSelecionado.executarTeste();
    }
    static async show() {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer_1.default.prompt([{
                    type: 'list',
                    name: 'acao',
                    message: '== Menu Testes ==',
                    choices: [
                        'Cadastrar Novo Teste',
                        'Listar Todos Testes',
                        'Executar Teste',
                        'Salvar Testes',
                        'Carregar Testes',
                        'Voltar'
                    ]
                }]);
            switch (acao) {
                case 'Cadastrar Novo Teste':
                    await this.cadastrarTeste();
                    break;
                case 'Listar Todos Testes':
                    await this.listarTestes();
                    break;
                case 'Executar Teste':
                    await this.executarTeste();
                    break;
                case 'Salvar Testes':
                    this.salvarTestes();
                    break;
                case 'Carregar Testes':
                    this.carregarTestes();
                    break;
                case 'Voltar':
                    sair = true;
                    break;
            }
        }
    }
}
exports.TesteCLI = TesteCLI;
TesteCLI.testes = [];
TesteCLI.DATA_FILE = 'data/testes.json';
