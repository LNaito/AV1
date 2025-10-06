import Aeronave from "../Aeronave";
import { TipoAeronave } from "../enum";
import fs from 'fs'
import path from "path";
import inquirer from "inquirer"

export class AeronaveCLI{
    static listaAeronaves: Aeronave[] = []
    private static aeronavesMap: Map<string, Aeronave> = new Map();
    private static readonly DATA_FILE = 'data/aeronaves.json';

    //== Métodos 

    static buscar(codigo:string): Aeronave | undefined {
        return this.aeronavesMap.get(codigo);

    }

    static salvarAeronaves():void{
        try{
            const dataDir = path.dirname(this.DATA_FILE)
            if(!fs.existsSync(dataDir)){
                fs.mkdirSync(dataDir, {recursive: true})
            }
            
            const dados = this.listaAeronaves.map(aeronave => ({
                codigo: aeronave.codigo,
                modelo: aeronave.modelo,
                tipoA: aeronave.tipoA,
                capacidade: aeronave.capacidade,
                alcance: aeronave.alcance,
                pecas: aeronave.pecas,
                etapas: aeronave.etapas,
                testes: aeronave.testes
            }))

             fs.writeFileSync(this.DATA_FILE, JSON.stringify(dados, null, 2));
             console.log(`${this.listaAeronaves.length} aeronave(s) salvas com sucesso em ${this.DATA_FILE}.`);
        }

            catch (error) {
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

                if (dado.pecas) aeronave.pecas = dado.pecas;
                if (dado.etapas) aeronave.etapas = dado.etapas;
                if (dado.testes) aeronave.testes = dado.testes;

                return aeronave;
            });

                console.log(`Carregamento concluído.`);
            } 
            
            catch (error) {
                console.error('Erro:', error);
            }
        }

        static async cadastrarAeronave(): Promise<void>{
            const dados = await inquirer.prompt([
                {type: 'input', name: 'codigo', message: 'Digite o código da Aeronave. '},
                {type: 'input', name: 'modelo', message: 'Digite o modelo da aeronave. '},
                {
                    type: 'list',
                    name: 'tipo',
                    message: 'Digite o tipo da sua Aeronave. (COMERCIAL ou MILITAR) ',
                    choices: Object.values(TipoAeronave)
                },
                {type: 'number', name: 'capacidade', message: 'Digite a capacidade de passageiros da sua Aeronave. '},
                {type: 'number', name: 'alcance', message: 'Em quilômetros, digite o alcance da Aeronave.'}
            ])
            
            const aeronave = new Aeronave(
                dados.codigo,
                dados.modelo,
                dados.tipo,
                dados.capacidade,
                dados.alcance,
                [], // Etapas
                [], // Pecas
                [] // Testes
            )
            this.listaAeronaves.push(aeronave)
            console.log('Aeronave cadadastrada com sucesso!')
        }

        static async listar(): Promise<void>{
            if (this.listaAeronaves.length === 0){
                console.log('Nenhuma aeronave cadastrada.')
                return
            }
            console.log('\n LISTA DE AERONAVES:')
            this.listaAeronaves.forEach((aeronave,index)=>{
                console.log(`${index + 1}. ${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipoA})`);
            })
        }

        static async buscarPorCodigo(): Promise<void>{
            const resposta:{codigo:string} = await inquirer.prompt([
                {type: 'input', name: 'codigo',message:'Para encontrar uma aeronave expecifica, digite o código da aeronave: '}
            ])
            const {codigo} = resposta
            const aeronave = this.buscar(codigo);

            if (aeronave) {
                console.log('Aeronave encontrada:');
            aeronave.detalhes();
            } else {
                console.log('Aeronave não foi encontrada.');
            }
        }

        static async show(): Promise<void> {
        const {acao} = await inquirer.prompt([
            {
                type: 'list',
                name: 'acao',
                message: '== Gerenciar Aeronaves',
                choices: [
                    '1 - Cadastrar Nova Aeronave',
                    '2 - Listar Todas Aeronaves',
                    '3 - Buscar Aeronave por código',
                    '4 - Salvar Aeronave',
                    '5 - Carregar Aeronave',
                    '0 - Sair'
                ]
            }
        ])
        switch (acao) {
            case '1':
                await   this.cadastrarAeronave()
                break;
            case '2':
                await this.listar()
                break
            case '3':
                await this.buscarPorCodigo()
                break
            case '4':
                this.salvarAeronaves()
                break
            case '5':
                this.carregar()
                break
            case '0':
                break
        }
    }

    }

