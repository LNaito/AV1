import Aeronave from "./Aeronave"
import fs from 'fs'
import path from 'path'


//Concluido
export default class Relatorio {
    constructor(public aeronave: Aeronave, public nomeCliente: string, public dataEntrega: Date) {}

    gerarRelatorio(): string {
        let relatorio = `=== Informações da Aeronave ${this.aeronave.modelo}: \n`
        relatorio += `Código: ${this.aeronave.codigo}\n`
        relatorio += `Modelo: ${this.aeronave.modelo}\n`
        relatorio += `Tipo: ${this.aeronave.tipoA}\n`
        relatorio += `Capacidade: ${this.aeronave.capacidade} passageiros\n`
        relatorio += `Alcance: ${this.aeronave.alcance}km \n\n`
        relatorio += '== Sobre a Entrega: \n';
        relatorio += `Cliente: ${this.nomeCliente}\n`;
        relatorio += `Data de Entrega: ${this.dataEntrega.toLocaleDateString()}\n\n`
        relatorio += `== Peças utilizadas: \n`
        if (this.aeronave.pecas.length > 0) {
            this.aeronave.pecas.forEach((peca, index) => {
                relatorio += `${index + 1}. ${peca.getNomePeca}, ${peca.getTipoP}, ${peca.getFornecedor}. ${peca.getStatus}\n`
            });
        } 
        
        else {
            relatorio += 'Nenhuma peça associada. \n'
        }

        relatorio += '\n'
        
        relatorio += `Etapas:\n`
        if (this.aeronave.etapas.length > 0) {
            this.aeronave.etapas.forEach((etapa, index) => {
                relatorio += `\n - ${index + 1}. ${etapa.nome}\n Prazo: ${etapa.prazo} \nStatus: ${etapa.statusE}\n`
            });
        } else {
            relatorio += '   Nenhuma etapa associada\n';
        }
        relatorio += '\n';
        
        relatorio += `Resultado dos testes:\n`;
        if (this.aeronave.testes.length > 0) {
            this.aeronave.testes.forEach((teste, index) => {
                relatorio += `${index + 1}. ${teste.tipoT}. Resultado: ${teste.resultado}\n`;
            });
        } else {
            relatorio += '   Nenhum teste realizado\n';
        }

        return relatorio;
    }

    salvarRelatorio(): void {
        try {
            const dataDir = 'data';
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            const ArquivoRel = `relatorio_${this.aeronave.modelo}_${this.aeronave.codigo}.txt`;
            const relatorioTexto = this.gerarRelatorio();
            
            fs.writeFileSync(path.join(dataDir, ArquivoRel), relatorioTexto);
            console.log(`Relatório salvo em: data/${ArquivoRel}`);
        } 
        
        catch (error) {
            console.error('Erro:', error);
        }
    }
}
