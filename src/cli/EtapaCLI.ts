import inquirer from "inquirer"
import Etapa from "../Etapa"
import { StatusEtapa } from "../enum"
import fs from 'fs'
import path from 'path'

export class EtapaCLI {
    static etapas: Etapa[] = [];
    private static etapasMap: Map<string, Etapa> = new Map();
    private static readonly DATA_FILE = 'data/etapas.json';

    static buscarNome(nome: string): Etapa | undefined {
        return this.etapasMap.get(nome);
    }

    static salvar(): void {
        try {
            const dataDir = path.dirname(this.DATA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const dadosSerializaveis = this.etapas.map(etapa => ({
                nome: etapa.nome,
                prazo: etapa.prazo,
                status: etapa.statusE
            }));

            fs.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`Etapa salva com sucesso em ${this.DATA_FILE}!`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static carregar(): void {
        try {
            if (!fs.existsSync(this.DATA_FILE)) {
                console.log('📭 Nenhum arquivo de etapas encontrado. Iniciando com lista vazia.');
                return;
            }

            const dados = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
            
            this.etapas = dados.map((dado: any) => {
                return new Etapa(
                    dado.nome,
                    dado.prazo,
                    dado.status,
                    []
                );
            });

            console.log(`Etapa carregada com sucesso!`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static async EtapaShow(): Promise<void> {
        const { acao } = await inquirer.prompt([
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

    static async cadastrarEtapa(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da Etapa: ' },
            { type: 'input', name: 'prazo', message: 'Digite o prazo: ' },
            { type: 'input', name: 'statusE', message: 'Qual o status dessa Etapa? (PENDENTE, ANDAMENTO ou CONCLUIDA) ' }
        ]);

        const etapa = new Etapa(
            dados.nome,
            dados.prazo,
            dados.statusE,
            []
        );

        this.etapas.push(etapa);
        this.etapasMap.set(dados.nome, etapa);
        console.log('Etapa cadastrada com sucesso!');
    }

    static async listarEtapas(): Promise<void> {
        if (this.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
            return;
        }

        console.log('\n == Lista de Etapas:');
        this.etapas.forEach((etapa, index) => {
            console.log(`${index + 1}. ${etapa.nome}, Prazo: ${etapa.prazo}, Status: ${etapa.statusE}`);
        });
    }

    static async buscarPorNome(): Promise<void> {
        const resposta: { nome: string } = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa: ' }
        ]);

        const { nome } = resposta;
        const etapa = this.buscarNome(nome);

        if (etapa) {
            console.log('✅ Etapa encontrada:');
            console.log(`Nome: ${etapa.nome}`);
            console.log(`Prazo: ${etapa.prazo}`);
            console.log(`Status: ${etapa.statusE}`);
        } else {
            console.log('Etapa não encontrada!');
        }
    }

    static async iniciarEtapa(): Promise<void> {
        const resposta: { nome: string } = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa para iniciar: ' }
        ]);

        const { nome } = resposta;
        const etapa = this.buscarNome(nome);

        if (etapa) {
            etapa.iniciar();
        } else {
            console.log('Essa etapa não existe.');
        }
    }

    static async finalizarEtapa(): Promise<void> {
        const resposta: { nome: string } = await inquirer.prompt([
            { type: 'input', name: 'nome', message: 'Digite o nome da etapa para finalizar: ' }
        ]);

        const { nome } = resposta;
        const etapa = this.buscarNome(nome);

        if (etapa) {
            etapa.finalizar();
        } else {
            console.log('Essa etapa não existe.');
        }
    }
}