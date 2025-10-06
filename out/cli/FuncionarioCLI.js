"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionarioCLI = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const Funcionario_1 = __importDefault(require("../Funcionario"));
const enum_1 = require("../enum");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FuncionarioCLI {
    static buscarFuncionarioPorId(id) {
        return this.funcionariosMap.get(id);
    }
    static salvarFuncionarios() {
        try {
            const dataDir = path_1.default.dirname(this.DATA_FILE);
            if (!fs_1.default.existsSync(dataDir))
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            const dadosSerializaveis = this.funcionarios.map(funcionario => ({
                id: funcionario.getId,
                nome: funcionario.getNome,
                telefone: funcionario.getTelefone,
                endereco: funcionario.getEndereco,
                usuario: funcionario.getUsuario,
                senha: funcionario.getSenha,
                nivelPermissao: funcionario.getNivelPermissao
            }));
            fs_1.default.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`✅ ${this.funcionarios.length} funcionário(s) salvo(s) com sucesso em ${this.DATA_FILE}!`);
        }
        catch (error) {
            console.error('Erro ao salvar funcionários:', error);
        }
    }
    static carregarFuncionarios() {
        try {
            if (!fs_1.default.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de funcionários encontrado. Iniciando com lista vazia.');
                return;
            }
            const dados = JSON.parse(fs_1.default.readFileSync(this.DATA_FILE, 'utf8'));
            this.funcionarios = dados.map((dado) => new Funcionario_1.default(dado.id, dado.nome, dado.telefone, dado.endereco, dado.usuario, dado.senha, dado.nivelPermissao));
            console.log(`✅ ${this.funcionarios.length} funcionário(s) carregado(s) com sucesso!`);
        }
        catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        }
    }
    static async cadastrarFuncionario() {
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'id', message: 'Qual o ID do funcionário? ' },
            { type: 'input', name: 'nome', message: 'Qual o nome do funcionário? ' },
            { type: 'input', name: 'telefone', message: 'Qual o telefone do funcionário? ' },
            { type: 'input', name: 'endereco', message: 'Qual o endereço do funcionário? ' },
            { type: 'input', name: 'usuario', message: 'Qual o usuário do funcionário? ' },
            { type: 'password', name: 'senha', message: 'Qual a senha do funcionário? ' },
            { type: 'list', name: 'nivelPermissao', message: 'Qual o nível de permissão? ', choices: Object.values(enum_1.NivelPermissao) }
        ]);
        const funcionario = new Funcionario_1.default(dados.id, dados.nome, dados.telefone, dados.endereco, dados.usuario, dados.senha, dados.nivelPermissao);
        this.funcionarios.push(funcionario);
        this.funcionariosMap.set(dados.id, funcionario);
        console.log('Funcionário cadastrado com sucesso!');
    }
    static async listarFuncionarios() {
        if (this.funcionarios.length === 0) {
            console.log('Nenhum funcionário cadastrado.');
            return;
        }
        console.log('\n== LISTA DE FUNCIONÁRIOS ==');
        this.funcionarios.forEach((funcionario, index) => {
            console.log(`${index + 1}. ${funcionario.getId} - ${funcionario.getNome} - ${funcionario.getNivelPermissao}`);
        });
    }
    static async buscarPorId() {
        const { id } = await inquirer_1.default.prompt([{ type: 'input', name: 'id', message: 'Digite o ID do funcionário: ' }]);
        const funcionario = this.buscarFuncionarioPorId(id);
        if (funcionario) {
            console.log('✅ Funcionário encontrado:');
            console.log(`ID: ${funcionario.getId}`);
            console.log(`Nome: ${funcionario.getNome}`);
            console.log(`Telefone: ${funcionario.getTelefone}`);
            console.log(`Endereço: ${funcionario.getEndereco}`);
            console.log(`Usuário: ${funcionario.getUsuario}`);
            console.log(`Nível de Permissão: ${funcionario.getNivelPermissao}`);
        }
        else {
            console.log('Funcionário não encontrado.');
        }
    }
    static async autenticarFuncionario() {
        const dados = await inquirer_1.default.prompt([
            { type: 'input', name: 'usuario', message: 'Usuário: ' },
            { type: 'password', name: 'senha', message: 'Senha: ' }
        ]);
        const funcionario = this.funcionarios.find(f => f.getUsuario === dados.usuario && f.getSenha === dados.senha);
        if (funcionario) {
            console.log('✅ Autenticação bem-sucedida!');
            console.log(`Bem-vindo, ${funcionario.getNome}!`);
        }
        else {
            console.log('❌ Usuário ou senha incorretos!');
        }
    }
    static async show() {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer_1.default.prompt([{
                    type: 'list',
                    name: 'acao',
                    message: '== Menu Funcionários ==',
                    choices: [
                        'Cadastrar Novo Funcionário',
                        'Listar Todos Funcionários',
                        'Buscar Funcionário por ID',
                        'Autenticar Funcionário',
                        'Salvar Funcionários',
                        'Carregar Funcionários',
                        'Voltar'
                    ]
                }]);
            switch (acao) {
                case 'Cadastrar Novo Funcionário':
                    await this.cadastrarFuncionario();
                    break;
                case 'Listar Todos Funcionários':
                    await this.listarFuncionarios();
                    break;
                case 'Buscar Funcionário por ID':
                    await this.buscarPorId();
                    break;
                case 'Autenticar Funcionário':
                    await this.autenticarFuncionario();
                    break;
                case 'Salvar Funcionários':
                    this.salvarFuncionarios();
                    break;
                case 'Carregar Funcionários':
                    this.carregarFuncionarios();
                    break;
                case 'Voltar':
                    sair = true;
                    break;
            }
        }
    }
}
exports.FuncionarioCLI = FuncionarioCLI;
FuncionarioCLI.funcionarios = [];
FuncionarioCLI.funcionariosMap = new Map();
FuncionarioCLI.DATA_FILE = 'data/funcionarios.json';
