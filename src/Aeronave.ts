import { TipoAeronave } from "./enum"
import Etapa from "./Etapa"
import Peca from "./Peca"
import Teste from "./Teste"
import fs from 'fs'

//Concluido
export default class Aeronave {
    codigo: string
    modelo: string
    tipoA: TipoAeronave
    capacidade: number
    alcance: number
    etapas: Etapa[] = []
    pecas: Peca[] = []
    testes: Teste[] = []

    constructor (codigo: string, modelo: string, tipoA: TipoAeronave, capacidade: number, alcance: number, etapas: Etapa[], pecas: Peca[], testes: Teste[]){
        this.codigo = codigo
        this.modelo = modelo
        this.tipoA = tipoA
        this.capacidade = capacidade
        this.alcance = alcance
        this.pecas = pecas
        this.etapas = etapas
        this.testes = testes
    }

    //== Métodos
    public detalhes(){
        console.log('== Detalhes da Aeronave ==')
        console.log(`Código: ${this.codigo}`)
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipoA}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance}km`);
        console.log(`Peças: ${this.pecas.length}`);
        console.log(`Etapas: ${this.etapas.length}`);
        console.log(`Testes: ${this.testes.length}`);

    }
    
    public addPeca(peca: Peca): void {
            this.pecas.push(peca);
        }

    public addEtapa(etapa: Etapa): void {
            this.etapas.push(etapa);
        }

    public addTeste(teste: Teste): void {
            this.testes.push(teste);
        }
    
    public salvar(): void {
        try {
            if (!fs.existsSync('data')) {
                fs.mkdirSync('data');
            }

            const dados = {
                codigo: this.codigo,
                modelo: this.modelo,
                tipo: this.tipoA,
                capacidade: this.capacidade,
                alcance: this.alcance,
                pecas: this.pecas.map(peca => ({
                    nome: peca.getNomePeca,
                    tipo: peca.getTipoP,
                    fornecedor: peca.getFornecedor,
                    status: peca.getStatus
                })),

                etapas: this.etapas.map(etapa => ({
                    nome: etapa.nome,
                    prazo: etapa.prazo,
                    status: etapa.statusE
                })),

                testes: this.testes.map(teste => ({
                    tipo: teste.tipoT,
                    resultado: teste.resultado
                }))

            };

            fs.writeFileSync(`data/aeronave_${this.modelo}_${this.codigo}.json`, JSON.stringify(dados, null, 2));
            console.log(`Aeronave salva com sucesso!`);
        } 
        
        catch (error) {
            console.error('Erro no salvamento:', error);
        }

    }

        public carregar(codigo: string): void {
        try {
            const arquivo = `data/aeronave_${codigo}.json`;
            
            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
                
                this.codigo = dados.codigo;
                this.modelo = dados.modelo;
                this.tipoA = dados.tipo;
                this.capacidade = dados.capacidade;
                this.alcance = dados.alcance;
                
                console.log(`Aeronave carregada com sucesso!`);
            } 
            
            else {
                console.log('Arquivo não encontrado');
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    }
}