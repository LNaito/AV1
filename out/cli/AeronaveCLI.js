"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AeronaveCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Aeronave_1 = __importDefault(require("../Aeronave"));
const enum_1 = require("../enum");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AeronaveCLI {
    static buscar(codigo) {
        return this.aeronavesMap.get(codigo);
    }
    static salvarAeronaves() {
        try {
            const dataDir = path_1.default.dirname(this.DATA_FILE);
            if (!fs_1.default.existsSync(dataDir))
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            const dados = this.listaAeronaves.map(aeronave => ({
                codigo: aeronave.codigo,
                modelo: aeronave.modelo,
                tipoA: aeronave.tipoA,
                capacidade: aeronave.capacidade,
                alcance: aeronave.alcance,
                pecas: aeronave.pecas,
                etapas: aeronave.etapas,
                testes: aeronave.testes
            }));
            fs_1.default.writeFileSync(this.DATA_FILE, JSON.stringify(dados, null, 2));
            console.log(`${this.listaAeronaves.length} aeronave(s) salvas com sucesso em ${this.DATA_FILE}.`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    static carregar() {
        try {
            if (!fs_1.default.existsSync(this.DATA_FILE)) {
                console.log('Nenhum arquivo encontrado.');
                return;
            }
            const dados = JSON.parse(fs_1.default.readFileSync(this.DATA_FILE, 'utf8'));
            this.listaAeronaves = dados.map((dado) => {
                const aeronave = new Aeronave_1.default(dado.codigo, dado.modelo, dado.tipoA, dado.capacidade, dado.alcance, dado.etapas ?? [], dado.pecas ?? [], dado.testes ?? []);
                return aeronave;
            });
            console.log(`Carregamento concluído.`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    static async cadastrarAeronave() {
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'codigo', message: 'Digite o código da Aeronave.' },
            { type: 'input', name: 'modelo', message: 'Digite o modelo da aeronave.' },
            { type: 'list', name: 'tipo', message: 'Tipo da Aeronave:', choices: Object.values(enum_1.TipoAeronave) },
            { type: 'number', name: 'capacidade', message: 'Capacidade de passageiros.' },
            { type: 'number', name: 'alcance', message: 'Alcance em km.' }
        ]);
        const aeronave = new Aeronave_1.default(dados.codigo, dados.modelo, dados.tipo, dados.capacidade, dados.alcance, [], [], []);
        this.listaAeronaves.push(aeronave);
        this.aeronavesMap.set(dados.codigo, aeronave);
        console.log('Aeronave cadastrada com sucesso!');
    }
    static async listar() {
        if (this.listaAeronaves.length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }
        console.log('\n== LISTA DE AERONAVES ==');
        this.listaAeronaves.forEach((aeronave, index) => {
            console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipoA})`);
        });
    }
    static async buscarPorCodigo() {
        const { codigo } = await inquirer_1.default.prompt([
            { type: 'input', name: 'codigo', message: 'Digite o código da aeronave:' }
        ]);
        const aeronave = this.buscar(codigo);
        if (aeronave) {
            console.log('Aeronave encontrada:');
            aeronave.detalhes();
        }
        else {
            console.log('Aeronave não encontrada.');
        }
    }
    static async show() {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'acao',
                    message: '== Gerenciar Aeronaves ==',
                    choices: [
                        'Cadastrar Nova Aeronave',
                        'Listar Todas Aeronaves',
                        'Buscar Aeronave por código',
                        'Salvar Aeronave',
                        'Carregar Aeronave',
                        'Voltar'
                    ]
                }
            ]);
            switch (acao) {
                case 'Cadastrar Nova Aeronave':
                    await this.cadastrarAeronave();
                    break;
                case 'Listar Todas Aeronaves':
                    await this.listar();
                    break;
                case 'Buscar Aeronave por código':
                    await this.buscarPorCodigo();
                    break;
                case 'Salvar Aeronave':
                    this.salvarAeronaves();
                    break;
                case 'Carregar Aeronave':
                    this.carregar();
                    break;
                case 'Voltar':
                    sair = true;
                    break;
            }
        }
    }
}
exports.AeronaveCLI = AeronaveCLI;
AeronaveCLI.listaAeronaves = [];
AeronaveCLI.aeronavesMap = new Map();
AeronaveCLI.DATA_FILE = 'data/aeronaves.json';
