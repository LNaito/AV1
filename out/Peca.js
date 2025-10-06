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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Concluido
class Peca {
    constructor(nomePeca, tipoP, fornecedor, status) {
        this.nomePeca = nomePeca;
        this.tipoP = tipoP;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    //== Getters e Setters
    get getNomePeca() {
        return this.nomePeca;
    }
    get getTipoP() {
        return this.tipoP;
    }
    get getFornecedor() {
        return this.fornecedor;
    }
    get getStatus() {
        return this.status;
    }
    //== Métodos
    atualizarStatus(novoStatus) {
        this.status = novoStatus;
    }
    salvar() {
        try {
            const dataDir = path.resolve('data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir);
            }
            const fileName = `${this.nomePeca.replace(/ /g, '_')}.json`;
            const filePath = path.join(dataDir, fileName);
            const dados = {
                nome: this.nomePeca,
                tipo: this.tipoP,
                fornecedor: this.fornecedor,
                status: this.status
            };
            fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
            console.log(`Peça salva com sucesso em: ${filePath}`);
        }
        catch (erro) {
            console.error("Erro ao salvar a peça:", erro);
        }
    }
    carregar(nomeArquivo) {
        const dataDir = path.resolve('data');
        const filePath = path.join(dataDir, `${nomeArquivo}.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo ${filePath} não encontrado.`);
            return;
        }
        const dados = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.nomePeca = dados.nome;
        this.tipoP = dados.tipo;
        this.fornecedor = dados.fornecedor;
        this.status = dados.status;
        console.log(`Peça carregada de ${filePath}`);
    }
}
exports.default = Peca;
