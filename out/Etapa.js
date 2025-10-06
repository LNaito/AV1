"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("./enum");
const fs = __importStar(require("fs"));
//Concluido
class Etapa {
    constructor(nome, prazo, statusE, funcionarios) {
        this.funcionarios = [];
        this.nome = nome;
        this.prazo = prazo;
        this.statusE = statusE;
        this.funcionarios = funcionarios;
    }
    //== Métodos
    iniciar() {
        if (this.statusE == enum_1.StatusEtapa.PENDENTE) {
            this.statusE = enum_1.StatusEtapa.ANDAMENTO;
            console.log(`Etapa iniciada!`);
        }
        else {
            console.log(`Não foi possível iniciar a etapa ${this.nome}, reavalie e tente novamente.`);
        }
    }
    finalizar() {
        if (this.statusE == enum_1.StatusEtapa.ANDAMENTO) {
            this.statusE = enum_1.StatusEtapa.CONCLUIDA;
            console.log(`Etapa finalizada!`);
        }
        else {
            console.log(`Não foi possível iniciar a etapa ${this.nome}, reavalie e tente novamente.`);
        }
    }
    associarFuncionarios(funcionario) {
        if (!this.funcionarios.find(f => f.getId === funcionario.getId)) {
            this.funcionarios.push(funcionario);
            console.log(`O funcionário ${funcionario.getNome} foi associado a etapa ${this.nome} com sucesso!`);
        }
        else {
            console.log(`Não foi possível realizar essa ação. ${funcionario.getNome} já está associado a outra etapa.`);
        }
    }
    listarFuncionarios() {
        return this.funcionarios;
    }
    salvar() {
        try {
            if (!fs.existsSync('data')) {
                fs.mkdirSync('data');
            }
            const dados = {
                nome: this.nome,
                prazo: this.prazo,
                statusE: this.statusE,
                funcionarios: this.funcionarios.map(func => ({
                    id: func.getId,
                    nome: func.getNome
                }))
            };
            fs.writeFileSync(`data/etapa_${this.nome.replace(/\s+/g, '_')}.json`, JSON.stringify(dados, null, 2));
            console.log(`Etapa ${this.nome} salva com sucesso!`);
        }
        catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }
    carregar(nomeEtapa) {
        try {
            const arquivo = `data/etapa_${nomeEtapa.replace(/\s+/g, '_')}.json`;
            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
                this.nome = dados.nome;
                this.prazo = dados.prazo;
                this.statusE = dados.statusE;
                console.log(`Etapa ${nomeEtapa} carregada com sucesso!`);
            }
            else {
                console.log('Arquivo não encontrado');
            }
        }
        catch (error) {
            console.error("Erro ao carregar etapa:", error);
        }
    }
}
exports.default = Etapa;
