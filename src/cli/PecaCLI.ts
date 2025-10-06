import inquirer from "inquirer";
import Peca from "../Peca";
import { TipoPeca, StatusPeca } from "../enum";
import fs from 'fs'
import path from 'path'

export class PecaCLI {
    static pecas: Peca[] = [];
    private static pecasMap: Map<string, Peca> = new Map();
    private static readonly DATA_FILE = 'data/pecas.json';

    static buscarPecaPorNome(nome: string): Peca | undefined {
        return this.pecasMap.get(nome);
    }

    static salvarPecas(): void {
        try {
            const dataDir = path.dirname(this.DATA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const dadosSerializaveis = this.pecas.map(peca => ({
                nome: peca.getNomePeca,
                tipo: peca.getTipoP,
                fornecedor: peca.getFornecedor,
                status: peca.getStatus
            }));

            fs.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`✅ ${this.pecas.length} peça(s) salvas com sucesso em ${this.DATA_FILE}!`);
        } catch (error) {
            console.error('❌ Erro ao salvar peças:', error);
        }
    }

    static carregarPecas(): void {
        try {
            if (!fs.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de peças encontrado. Iniciando com lista vazia.');
                return;
            }

            const dados = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
            
            this.pecas = dados.map((dado: any) => {
                return new Peca(
                    dado.nome,
                    dado.tipo,
                    dado.fornecedor,
                    dado.status
                );
            });

            console.log(`✅ ${this.pecas.length} peça(s) carregadas com sucesso!`);
        } catch (error) {
            console.error('❌ Erro ao carregar peças:', error);
        }
    }

    static async show(): Promise<void> {
        const { acao } = await inquirer.prompt([
            {
                type: 'list',
                name: 'acao',
                message: 'Menu Peças',
                choices: [
                    'Cadastrar Nova Peça',
                    'Listar Todas Peças',
                    'Buscar Peça por nome',
                    'Atualizar Status da Peça',
                    'Salvar Peças',
                    'Carregar Peças',
                    'Voltar'
                ]
            }
        ]);

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
                break;
        }
    }

    static async cadastrarPeca(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Qual o nome da peça? ' },
            {
                type: 'list',
                name: 'tipo',
                message: 'Qual o tipo da peça? ',
                choices: Object.values(TipoPeca)
            },
            { type: 'input', name: 'fornecedor', message: 'Qual o fornecedor da peça? ' },
            {
                type: 'list',
                name: 'status',
                message: 'Qual o status inicial da peça? ',
                choices: Object.values(StatusPeca)
            }
        ]);

        const peca = new Peca(
            dados.nome,
            dados.tipo,
            dados.fornecedor,
            dados.status
        );

        this.pecas.push(peca);
        this.pecasMap.set(dados.nome, peca);
        console.log('Peça cadastrada com sucesso!');
    }

    static async listarPecas(): Promise<void> {
        if (this.pecas.length === 0) {
            console.log('Nenhuma peça cadastrada.');
            return;
        }

        console.log('\n LISTA DE PEÇAS:');
        this.pecas.forEach((peca, index) => {
            console.log(`${index + 1}. ${peca.getNomePeca} - ${peca.getTipoP} - ${peca.getFornecedor} - ${peca.getStatus}`);
        });
    }

    static async buscarPorNome(): Promise<void> {
        const resposta: { nome: string } = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da peça: ' }
        ]);

        const { nome } = resposta;
        const peca = this.buscarPecaPorNome(nome);

        if (peca) {
            console.log('✅ Peça encontrada:');
            console.log(`Nome: ${peca.getNomePeca}`);
            console.log(`Tipo: ${peca.getTipoP}`);
            console.log(`Fornecedor: ${peca.getFornecedor}`);
            console.log(`Status: ${peca.getStatus}`);
        } else {
            console.log('❌ Peça não encontrada!');
        }
    }

    static async atualizarStatusPeca(): Promise<void> {
        const resposta: { nome: string } = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da peça para atualizar status: ' }
        ]);

        const { nome } = resposta;
        const peca = this.buscarPecaPorNome(nome);

        if (peca) {
            const { novoStatus } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'novoStatus',
                    message: 'Selecione o novo status:',
                    choices: Object.values(StatusPeca)
                }
            ]);

            peca.atualizarStatus(novoStatus);
            console.log('✅ Status atualizado com sucesso!');
        } else {
            console.log('❌ Peça não encontrada!');
        }
    }
}