import inquirer from "inquirer";
import Funcionario from "../Funcionario";
import { NivelPermissao } from "../enum";
import fs from 'fs'
import path from 'path'

export class FuncionarioCLI {
    static funcionarios: Funcionario[] = [];
    private static funcionariosMap: Map<string, Funcionario> = new Map();
    private static readonly DATA_FILE = 'data/funcionarios.json';

    static buscarFuncionarioPorId(id: string): Funcionario | undefined {
        return this.funcionariosMap.get(id);
    }

    static salvarFuncionarios(): void {
        try {
            const dataDir = path.dirname(this.DATA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const dadosSerializaveis = this.funcionarios.map(funcionario => ({
                id: funcionario.getId,
                nome: funcionario.getNome,
                telefone: funcionario.getTelefone,
                endereco: funcionario.getEndereco,
                usuario: funcionario.getUsuario,
                senha: funcionario.getSenha,
                nivelPermissao: funcionario.getNivelPermissao
            }));

            fs.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`✅ ${this.funcionarios.length} funcionário(s) salvo(s) com sucesso em ${this.DATA_FILE}!`);
        } catch (error) {
            console.error('❌ Erro ao salvar funcionários:', error);
        }
    }

    static carregarFuncionarios(): void {
        try {
            if (!fs.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de funcionários encontrado. Iniciando com lista vazia.');
                return;
            }

            const dados = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
            
            this.funcionarios = dados.map((dado: any) => {
                return new Funcionario(
                    dado.id,
                    dado.nome,
                    dado.telefone,
                    dado.endereco,
                    dado.usuario,
                    dado.senha,
                    dado.nivelPermissao
                );
            });

            console.log(`✅ ${this.funcionarios.length} funcionário(s) carregado(s) com sucesso!`);
        } catch (error) {
            console.error('❌ Erro ao carregar funcionários:', error);
        }
    }

    static async show(): Promise<void> {
        const { acao } = await inquirer.prompt([
            {
                type: 'list',
                name: 'acao',
                message: 'Menu Funcionários',
                choices: [
                    'Cadastrar Novo Funcionário',
                    'Listar Todos Funcionários',
                    'Buscar Funcionário por ID',
                    'Autenticar Funcionário',
                    'Salvar Funcionários',
                    'Carregar Funcionários',
                    'Voltar'
                ]
            }
        ]);

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
                break;
        }
    }

    static async cadastrarFuncionario(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Qual o ID do funcionário? ' },
            { type: 'input', name: 'nome', message: 'Qual o nome do funcionário? ' },
            { type: 'input', name: 'telefone', message: 'Qual o telefone do funcionário? ' },
            { type: 'input', name: 'endereco', message: 'Qual o endereço do funcionário? ' },
            { type: 'input', name: 'usuario', message: 'Qual o usuário do funcionário? ' },
            { type: 'password', name: 'senha', message: 'Qual a senha do funcionário? ' },
            {
                type: 'list',
                name: 'nivelPermissao',
                message: 'Qual o nível de permissão? ',
                choices: Object.values(NivelPermissao)
            }
        ]);

        const funcionario = new Funcionario(
            dados.id,
            dados.nome,
            dados.telefone,
            dados.endereco,
            dados.usuario,
            dados.senha,
            dados.nivelPermissao
        );

        this.funcionarios.push(funcionario);
        this.funcionariosMap.set(dados.id, funcionario);
        console.log('Funcionário cadastrado com sucesso!');
    }

    static async listarFuncionarios(): Promise<void> {
        if (this.funcionarios.length === 0) {
            console.log('Nenhum funcionário cadastrado.');
            return;
        }

        console.log('\n LISTA DE FUNCIONÁRIOS:');
        this.funcionarios.forEach((funcionario, index) => {
            console.log(`${index + 1}. ${funcionario.getId} - ${funcionario.getNome} - ${funcionario.getNivelPermissao}`);
        });
    }

    static async buscarPorId(): Promise<void> {
        const resposta: { id: string } = await inquirer.prompt([
            { type: 'input', name: 'id', message: 'Digite o ID do funcionário: ' }
        ]);

        const { id } = resposta;
        const funcionario = this.buscarFuncionarioPorId(id);

        if (funcionario) {
            console.log('✅ Funcionário encontrado:');
            console.log(`ID: ${funcionario.getId}`);
            console.log(`Nome: ${funcionario.getNome}`);
            console.log(`Telefone: ${funcionario.getTelefone}`);
            console.log(`Endereço: ${funcionario.getEndereco}`);
            console.log(`Usuário: ${funcionario.getUsuario}`);
            console.log(`Nível de Permissão: ${funcionario.getNivelPermissao}`);
        } else {
            console.log('Funcionário não encontrado.');
        }
    }

    static async autenticarFuncionario(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'input', name: 'usuario', message: 'Usuário: ' },
            { type: 'password', name: 'senha', message: 'Senha: ' }
        ]);

        const funcionario = this.funcionarios.find(f => 
            f.getUsuario === dados.usuario && f.getSenha === dados.senha
        );

        if (funcionario) {
            console.log('✅ Autenticação bem-sucedida!');
            console.log(`Bem-vindo, ${funcionario.getNome}!`);
        } else {
            console.log('❌ Usuário ou senha incorretos!');
        }
    }
}