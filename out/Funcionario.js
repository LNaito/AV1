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
//Concluido
class Funcionario {
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    //== Getters e Setters
    get getId() {
        return this.id;
    }
    get getNome() {
        return this.nome;
    }
    get getTelefone() {
        return this.telefone;
    }
    get getEndereco() {
        return this.endereco;
    }
    get getUsuario() {
        return this.usuario;
    }
    get getSenha() {
        return this.senha;
    }
    get getNivelPermissao() {
        return this.nivelPermissao;
    }
    set setId(IdNovo) {
        this.id = IdNovo;
    }
    set setNome(NomeNovo) {
        this.nome = NomeNovo;
    }
    set setTelefone(TelefoneNovo) {
        this.telefone = TelefoneNovo;
    }
    set setEndereco(EnderecoNovo) {
        this.endereco = EnderecoNovo;
    }
    set setUsuario(UsuarioNovo) {
        this.usuario = UsuarioNovo;
    }
    set setSenha(SenhaNovo) {
        this.senha = SenhaNovo;
    }
    set setNivelPermissao(NivelPermNovo) {
        this.nivelPermissao = NivelPermNovo;
    }
    //== Métodos
    autenticar(usuario, senha) {
        if (usuario == this.getUsuario && senha == this.getSenha) {
            return true;
        }
        else {
            console.log(`Falha na autenticação, tente novamente.`);
            return false;
        }
    }
    salvar() {
        try {
            if (!fs.existsSync('data')) {
                fs.mkdirSync('data');
            }
            const dados = {
                id: this.id,
                nome: this.nome,
                telefone: this.telefone,
                endereco: this.endereco,
                usuario: this.usuario,
                senha: this.senha,
                nivelPermissao: this.nivelPermissao
            };
            fs.writeFileSync(`data/funcionario_${this.id}.json`, JSON.stringify(dados, null, 2));
            console.log(`Funcionário ${this.nome} salvo com sucesso!`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    carregar(idFuncionario) {
        try {
            const arquivo = `data/funcionario_${idFuncionario}.json`;
            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
                this.id = dados.id,
                    this.nome = dados.nome,
                    this.telefone = dados.telefone,
                    this.endereco = dados.endereco,
                    this.usuario = dados.usuario,
                    this.senha = dados.senha,
                    this.nivelPermissao = dados.nivelPermissao,
                    console.log(`Funcionário ${this.nome} carregado com sucesso!`);
            }
            else {
                console.log(`O funcionário requisitado não foi encontrado.`);
            }
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
}
exports.default = Funcionario;
