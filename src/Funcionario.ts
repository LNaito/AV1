import { NivelPermissao } from "./enum"
import * as fs from 'fs'

//Concluido
export default class Funcionario {
    id: string
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivelPermissao: NivelPermissao

    constructor (id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao){
        this.id = id
        this.nome = nome
        this.telefone = telefone
        this.endereco = endereco
        this.usuario = usuario
        this.senha = senha
        this.nivelPermissao = nivelPermissao
    }

    //== Getters e Setters
    public get getId(): string {
        return this.id
    }

    public get getNome(): string {
        return this.nome
    }

    public get getTelefone(): string {
        return this.telefone
    }

    public get getEndereco(): string {
        return this.endereco
    }

    public get getUsuario(): string {
        return this.usuario
    }

    public get getSenha(): string {
        return this.senha
    }

    public get getNivelPermissao(): NivelPermissao {
        return this.nivelPermissao
    }

    public set setId(IdNovo: string) {
        this.id = IdNovo
    }

    public set setNome(NomeNovo: string) {
        this.nome = NomeNovo
    }

    public set setTelefone(TelefoneNovo: string) {
        this.telefone = TelefoneNovo
    }

    public set setEndereco(EnderecoNovo: string) {
        this.endereco = EnderecoNovo
    }

    public set setUsuario(UsuarioNovo: string) {
        this.usuario = UsuarioNovo
    }

    public set setSenha(SenhaNovo: string) {
        this.senha = SenhaNovo
    }

    public set setNivelPermissao(NivelPermNovo: NivelPermissao) {
        this.nivelPermissao = NivelPermNovo
    }

    //== Métodos
    public autenticar(usuario: string, senha: string): boolean{
        if (usuario == this.getUsuario && senha == this.getSenha){
            return true
        } 
        
        else {
            console.log(`Falha na autenticação, tente novamente.`);
            return false; 
        }}

    public salvar(): void {
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

            fs.writeFileSync(`data/funcionario_${this.id}.json`, JSON.stringify(dados, null, 2))
            console.log(`Funcionário ${this.nome} salvo com sucesso!`)
        } 
        
        catch (error) {
            console.error('Erro:', error)
        }
    }

    public carregar(idFuncionario: string): void {
        try {
            const arquivo = `data/funcionario_${idFuncionario}.json`

            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))

                this.id = dados.id,
                this.nome = dados.nome,
                this.telefone = dados.telefone,
                this.endereco = dados.endereco,
                this.usuario = dados.usuario,
                this.senha = dados.senha,
                this.nivelPermissao = dados.nivelPermissao,

                console.log(`Funcionário ${this.nome} carregado com sucesso!`)
            } 
            
            else {
                console.log(`O funcionário requisitado não foi encontrado.`)
            }

        } catch (error) {
            console.error('Erro:', error)
        }

    }
}