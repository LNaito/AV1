import inquirer from "inquirer";
import Aeronave from "../Aeronave";
import { TipoAeronave } from "../enum";
import fs from 'fs'
import path from "path";

export class AeronaveCLI {
    static listaAeronaves: Aeronave[] = [];
    private static aeronavesMap: Map<string, Aeronave> = new Map();
    private static readonly DATA_FILE = 'data/aeronaves.json';

    static buscar(codigo: string): Aeronave | undefined {
        return this.aeronavesMap.get(codigo);
    }

    static salvarAeronaves(): void {
        try {
            const dataDir = path.dirname(this.DATA_FILE);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

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

            fs.writeFileSync(this.DATA_FILE, JSON.stringify(dados, null, 2));
            console.log(`${this.listaAeronaves.length} aeronave(s) salvas com sucesso em ${this.DATA_FILE}.`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static carregar(): void {
        try {
            if (!fs.existsSync(this.DATA_FILE)) {
                console.log('Nenhum arquivo encontrado.');
                return;
            }

            const dados = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
            this.listaAeronaves = dados.map((dado: any) => {
                const aeronave = new Aeronave(
                    dado.codigo,
                    dado.modelo,
                    dado.tipoA,
                    dado.capacidade,
                    dado.alcance,
                    dado.etapas ?? [],
                    dado.pecas ?? [],
                    dado.testes ?? []
                );
                return aeronave;
            });

            console.log(`Carregamento concluído.`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static async cadastrarAeronave(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'input', name: 'codigo', message: 'Digite o código da Aeronave.' },
            { type: 'input', name: 'modelo', message: 'Digite o modelo da aeronave.' },
            { type: 'list', name: 'tipo', message: 'Tipo da Aeronave:', choices: Object.values(TipoAeronave) },
            { type: 'number', name: 'capacidade', message: 'Capacidade de passageiros.' },
            { type: 'number', name: 'alcance', message: 'Alcance em km.' }
        ]);

        const aeronave = new Aeronave(
            dados.codigo,
            dados.modelo,
            dados.tipo,
            dados.capacidade,
            dados.alcance,
            [],
            [],
            []
        );

        this.listaAeronaves.push(aeronave);
        this.aeronavesMap.set(dados.codigo, aeronave);
        console.log('Aeronave cadastrada com sucesso!');
    }

    static async listar(): Promise<void> {
        if (this.listaAeronaves.length === 0) {
            console.log('Nenhuma aeronave cadastrada.');
            return;
        }

        console.log('\n== LISTA DE AERONAVES ==');
        this.listaAeronaves.forEach((aeronave, index) => {
            console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipoA})`);
        });
    }

    static async buscarPorCodigo(): Promise<void> {
        const { codigo } = await inquirer.prompt([
            { type: 'input', name: 'codigo', message: 'Digite o código da aeronave:' }
        ]);
        const aeronave = this.buscar(codigo);
        if (aeronave) {
            console.log('Aeronave encontrada:');
            aeronave.detalhes();
        } else {
            console.log('Aeronave não encontrada.');
        }
    }

    static async show(): Promise<void> {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer.prompt([
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
                case 'Cadastrar Nova Aeronave': await this.cadastrarAeronave(); break;
                case 'Listar Todas Aeronaves': await this.listar(); break;
                case 'Buscar Aeronave por código': await this.buscarPorCodigo(); break;
                case 'Salvar Aeronave': this.salvarAeronaves(); break;
                case 'Carregar Aeronave': this.carregar(); break;
                case 'Voltar': sair = true; break;
            }
        }
    }
}
