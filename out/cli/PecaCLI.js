"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PecaCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Peca_1 = __importDefault(require("../Peca"));
const enum_1 = require("../enum");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PecaCLI {
    static buscarPecaPorNome(nome) {
        return this.pecasMap.get(nome);
    }
    static salvarPecas() {
        try {
            const dataDir = path_1.default.dirname(this.DATA_FILE);
            if (!fs_1.default.existsSync(dataDir))
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            const dadosSerializaveis = this.pecas.map(peca => ({
                nome: peca.getNomePeca,
                tipo: peca.getTipoP,
                fornecedor: peca.getFornecedor,
                status: peca.getStatus
            }));
            fs_1.default.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`${this.pecas.length} peça(s) salvas com sucesso em ${this.DATA_FILE}!`);
        }
        catch (error) {
            console.error('Erro ao salvar peças:', error);
        }
    }
    static carregarPecas() {
        try {
            if (!fs_1.default.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de peças encontrado. Iniciando com lista vazia.');
                return;
            }
            const dados = JSON.parse(fs_1.default.readFileSync(this.DATA_FILE, 'utf8'));
            this.pecas = dados.map((dado) => new Peca_1.default(dado.nome, dado.tipo, dado.fornecedor, dado.status));
            console.log(`${this.pecas.length} peça(s) carregadas com sucesso!`);
        }
        catch (error) {
            console.error('Erro ao carregar peças:', error);
        }
    }
    static async cadastrarPeca() {
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'nome', message: 'Qual o nome da peça? ' },
            { type: 'list', name: 'tipo', message: 'Qual o tipo da peça? ', choices: Object.values(enum_1.TipoPeca) },
            { type: 'input', name: 'fornecedor', message: 'Qual o fornecedor da peça? ' },
            { type: 'list', name: 'status', message: 'Qual o status inicial da peça? ', choices: Object.values(enum_1.StatusPeca) }
        ]);
        const peca = new Peca_1.default(dados.nome, dados.tipo, dados.fornecedor, dados.status);
        this.pecas.push(peca);
        this.pecasMap.set(dados.nome, peca);
        console.log('Peça cadastrada com sucesso!');
    }
    static async listarPecas() {
        if (this.pecas.length === 0) {
            console.log('Nenhuma peça cadastrada.');
            return;
        }
        console.log('\n== LISTA DE PEÇAS ==');
        this.pecas.forEach((peca, index) => {
            console.log(`${index + 1}. ${peca.getNomePeca} - ${peca.getTipoP} - ${peca.getFornecedor} - ${peca.getStatus}`);
        });
    }
    static async buscarPorNome() {
        const { nome } = await inquirer_1.default.prompt([{ type: 'input', name: 'nome', message: 'Digite o nome da peça: ' }]);
        const peca = this.buscarPecaPorNome(nome);
        if (peca) {
            console.log('Peça encontrada:');
            console.log(`Nome: ${peca.getNomePeca}`);
            console.log(`Tipo: ${peca.getTipoP}`);
            console.log(`Fornecedor: ${peca.getFornecedor}`);
            console.log(`Status: ${peca.getStatus}`);
        }
        else {
            console.log('Peça não encontrada!');
        }
    }
    static async atualizarStatusPeca() {
        const { nome } = await inquirer_1.default.prompt([{ type: 'input', name: 'nome', message: 'Digite o nome da peça para atualizar status: ' }]);
        const peca = this.buscarPecaPorNome(nome);
        if (peca) {
            const { novoStatus } = await inquirer_1.default.prompt([{ type: 'list', name: 'novoStatus', message: 'Selecione o novo status:', choices: Object.values(enum_1.StatusPeca) }]);
            peca.atualizarStatus(novoStatus);
            console.log('Status atualizado com sucesso!');
        }
        else {
            console.log('Peça não encontrada!');
        }
    }
    static async show() {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer_1.default.prompt([{
                    type: 'list',
                    name: 'acao',
                    message: '== Menu Peças ==',
                    choices: [
                        'Cadastrar Nova Peça',
                        'Listar Todas Peças',
                        'Buscar Peça por nome',
                        'Atualizar Status da Peça',
                        'Salvar Peças',
                        'Carregar Peças',
                        'Voltar'
                    ]
                }]);
            switch (acao) {
                case 'Cadastrar Nova Peça':
                    await this.cadastrarPeca();
                    break;
                case 'Listar Todas Peças':
                    await this.listarPecas();
                    break;
                case 'Buscar Peça por nome':
                    await this.buscarPorNome();
                    break;
                case 'Atualizar Status da Peça':
                    await this.atualizarStatusPeca();
                    break;
                case 'Salvar Peças':
                    this.salvarPecas();
                    break;
                case 'Carregar Peças':
                    this.carregarPecas();
                    break;
                case 'Voltar':
                    sair = true;
                    break;
            }
        }
    }
}
exports.PecaCLI = PecaCLI;
PecaCLI.pecas = [];
PecaCLI.pecasMap = new Map();
PecaCLI.DATA_FILE = 'data/pecas.json';
