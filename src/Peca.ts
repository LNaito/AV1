import { TipoPeca, StatusPeca } from "./enum"
import * as fs from 'fs'
import * as path from 'path'

// Concluido
export default class Peca{
    nomePeca: string
    tipoP: TipoPeca
    fornecedor: string
    status: StatusPeca

    constructor (nomePeca: string, tipoP: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nomePeca = nomePeca
        this.tipoP = tipoP
        this.fornecedor = fornecedor
        this.status = status
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
    public atualizarStatus(novoStatus: StatusPeca){
        this.status = novoStatus;
    }

    public salvar() {
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
        } catch (erro) {
            console.error("Erro ao salvar a peça:", erro);
        }
    }


    public carregar(nomeArquivo: string) {
        const dataDir = path.resolve('data')
        const filePath = path.join(dataDir, `${nomeArquivo}.json`)

        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo ${filePath} não encontrado.`)
            return;
        }
        const dados = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        this.nomePeca = dados.nome
        this.tipoP = dados.tipo
        this.fornecedor = dados.fornecedor
        this.status = dados.status

        console.log(`Peça carregada de ${filePath}`)
    }
}