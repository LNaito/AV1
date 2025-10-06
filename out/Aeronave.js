"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
//Concluido
class Aeronave {
    constructor(codigo, modelo, tipoA, capacidade, alcance, etapas, pecas, testes) {
        this.etapas = [];
        this.pecas = [];
        this.testes = [];
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipoA = tipoA;
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.pecas = pecas;
        this.etapas = etapas;
        this.testes = testes;
    }
    //== Métodos
    detalhes() {
        console.log('== Detalhes da Aeronave ==');
        console.log(`Código: ${this.codigo}`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipoA}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance}km`);
        console.log(`Peças: ${this.pecas.length}`);
        console.log(`Etapas: ${this.etapas.length}`);
        console.log(`Testes: ${this.testes.length}`);
    }
    addPeca(peca) {
        this.pecas.push(peca);
    }
    addEtapa(etapa) {
        this.etapas.push(etapa);
    }
    addTeste(teste) {
        this.testes.push(teste);
    }
    salvar() {
        try {
            if (!fs_1.default.existsSync('data')) {
                fs_1.default.mkdirSync('data');
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
            fs_1.default.writeFileSync(`data/aeronave_${this.modelo}_${this.codigo}.json`, JSON.stringify(dados, null, 2));
            console.log(`Aeronave salva com sucesso!`);
        }
        catch (error) {
            console.error('Erro no salvamento:', error);
        }
    }
    carregar(codigo) {
        try {
            const arquivo = `data/aeronave_${codigo}.json`;
            if (fs_1.default.existsSync(arquivo)) {
                const dados = JSON.parse(fs_1.default.readFileSync(arquivo, 'utf8'));
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
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
}
exports.default = Aeronave;
