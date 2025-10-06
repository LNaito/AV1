"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtapaCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Etapa_1 = __importDefault(require("../Etapa"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EtapaCLI {
    static buscarNome(nome) {
        return this.etapasMap.get(nome);
    }
    static salvar() {
        try {
            const dataDir = path_1.default.dirname(this.DATA_FILE);
            if (!fs_1.default.existsSync(dataDir)) {
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            }
            const dadosSerializaveis = this.etapas.map(etapa => ({
                nome: etapa.nome,
                prazo: etapa.prazo,
                status: etapa.statusE
            }));
            fs_1.default.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`Etapa salva com sucesso em ${this.DATA_FILE}!`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    static carregar() {
        try {
            if (!fs_1.default.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de etapas encontrado. Iniciando com lista vazia.');
                return;
            }
            const dados = JSON.parse(fs_1.default.readFileSync(this.DATA_FILE, 'utf8'));
            this.etapas = dados.map((dado) => {
                return new Etapa_1.default(dado.nome, dado.prazo, dado.status, []);
            });
            console.log(`Etapa carregada com sucesso!`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    static async EtapaShow() {
        const { acao } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'acao',
                message: '== Gerenciar Etapas',
                choices: [
                    'Cadastrar etapa',
                    'Listar etapas',
                    'Buscar etapa',
                    'Iniciar etapa',
                    'Finalizar etapa',
                    'Salvar',
                    'Carregar',
                    'Sair'
                ]
            }
        ]);
        switch (acao) {
            case 'Cadastrar etapa':
                await this.cadastrarEtapa();
                break;
            case 'Listar etapas':
                await this.listarEtapas();
                break;
            case 'Buscar etapa':
                await this.buscarPorNome();
                break;
            case 'Iniciar etapa':
                await this.iniciarEtapa();
                break;
            case 'Finalizar etapa':
                await this.finalizarEtapa();
                break;
            case 'Salvar':
                this.salvar();
                break;
            case 'Carregar':
                this.carregar();
                break;
            case 'Sair':
                break;
        }
    }
    static async cadastrarEtapa() {
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da Etapa: ' },
            { type: 'input', name: 'prazo', message: 'Digite o prazo: ' },
            { type: 'input', name: 'statusE', message: 'Qual o status dessa Etapa? (PENDENTE, ANDAMENTO ou CONCLUIDA) ' }
        ]);
        const etapa = new Etapa_1.default(dados.nome, dados.prazo, dados.statusE, []);
        this.etapas.push(etapa);
        this.etapasMap.set(dados.nome, etapa);
        console.log('Etapa cadastrada com sucesso!');
    }
    static async listarEtapas() {
        if (this.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
            return;
        }
        console.log('\n == Lista de Etapas:');
        this.etapas.forEach((etapa, index) => {
            console.log(`${index + 1}. ${etapa.nome}, Prazo: ${etapa.prazo}, Status: ${etapa.statusE}`);
        });
    }
    static async buscarPorNome() {
        const resposta = await inquirer_1.default.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa: ' }
        ]);
        const { nome } = resposta;
        const etapa = this.buscarNome(nome);
        if (etapa) {
            console.log('✅ Etapa encontrada:');
            console.log(`Nome: ${etapa.nome}`);
            console.log(`Prazo: ${etapa.prazo}`);
            console.log(`Status: ${etapa.statusE}`);
        }
        else {
            console.log('Etapa não encontrada!');
        }
    }
    static async iniciarEtapa() {
        const resposta = await inquirer_1.default.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa para iniciar: ' }
        ]);
        const { nome } = resposta;
        const etapa = this.buscarNome(nome);
        if (etapa) {
            etapa.iniciar();
        }
        else {
            console.log('Essa etapa não existe.');
        }
    }
    static async finalizarEtapa() {
        const resposta = await inquirer_1.default.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa para finalizar: ' }
        ]);
        const { nome } = resposta;
        const etapa = this.buscarNome(nome);
        if (etapa) {
            etapa.finalizar();
        }
        else {
            console.log('Essa etapa não existe.');
        }
    }
}
exports.EtapaCLI = EtapaCLI;
EtapaCLI.etapas = [];
EtapaCLI.etapasMap = new Map();
EtapaCLI.DATA_FILE = 'data/etapas.json';
