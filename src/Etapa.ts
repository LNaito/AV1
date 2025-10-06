import { StatusEtapa } from "./enum"
import Funcionario from "./Funcionario"
import * as fs from 'fs'

//Concluido
export default class Etapa {
    nome: string
    prazo: string
    statusE: StatusEtapa
    funcionarios: Funcionario[] = []

    constructor (nome: string, prazo: string, statusE: StatusEtapa, funcionarios: Funcionario[]){
        this.nome = nome
        this.prazo = prazo
        this.statusE = statusE
        this.funcionarios = funcionarios
    }

    //== Métodos
    public iniciar(): void{
        if (this.statusE == StatusEtapa.PENDENTE) {
            this.statusE = StatusEtapa.ANDAMENTO
            console.log(`Etapa iniciada!`)
        }

        else{
            console.log(`Não foi possível iniciar a etapa ${this.nome}, reavalie e tente novamente.`)
        }

    }

    public finalizar(): void{
        if (this.statusE == StatusEtapa.ANDAMENTO) {
            this.statusE = StatusEtapa.CONCLUIDA
            console.log(`Etapa finalizada!`)
        }

        else{
            console.log(`Não foi possível iniciar a etapa ${this.nome}, reavalie e tente novamente.`)
        }
    }

    public associarFuncionarios(funcionario: Funcionario): void{
        if(!this.funcionarios.find(f => f.getId === funcionario.getId)){
            this.funcionarios.push(funcionario)
            console.log(`O funcionário ${funcionario.getNome} foi associado a etapa ${this.nome} com sucesso!`)
        }
        else{
            console.log(`Não foi possível realizar essa ação. ${funcionario.getNome} já está associado a outra etapa.`)
        }

    }

    public listarFuncionarios(){
        return this.funcionarios
    }


    public salvar(): void {
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
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }

    public carregar(nomeEtapa: string): void {
        try {
            const arquivo = `data/etapa_${nomeEtapa.replace(/\s+/g, '_')}.json`;
            
            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
                
                this.nome = dados.nome
                this.prazo = dados.prazo
                this.statusE = dados.statusE
                
                console.log(`Etapa ${nomeEtapa} carregada com sucesso!`);
            } else {
                console.log('Arquivo não encontrado');
            }
        } catch (error) {
            console.error("Erro ao carregar etapa:", error);
        }
    }
}