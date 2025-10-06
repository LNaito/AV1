"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//Concluido
class Relatorio {
    constructor(aeronave, nomeCliente, dataEntrega) {
        this.aeronave = aeronave;
        this.nomeCliente = nomeCliente;
        this.dataEntrega = dataEntrega;
    }
    gerarRelatorio() {
        let relatorio = `=== Informações da Aeronave ${this.aeronave.modelo}: \n`;
        relatorio += `Código: ${this.aeronave.codigo}\n`;
        relatorio += `Modelo: ${this.aeronave.modelo}\n`;
        relatorio += `Tipo: ${this.aeronave.tipoA}\n`;
        relatorio += `Capacidade: ${this.aeronave.capacidade} passageiros\n`;
        relatorio += `Alcance: ${this.aeronave.alcance}km \n\n`;
        relatorio += '== Sobre a Entrega: \n';
        relatorio += `Cliente: ${this.nomeCliente}\n`;
        relatorio += `Data de Entrega: ${this.dataEntrega.toLocaleDateString()}\n\n`;
        relatorio += `== Peças utilizadas: \n`;
        if (this.aeronave.pecas.length > 0) {
            this.aeronave.pecas.forEach((peca, index) => {
                relatorio += `${index + 1}. ${peca.getNomePeca}, ${peca.getTipoP}, ${peca.getFornecedor}. ${peca.getStatus}\n`;
            });
        }
        else {
            relatorio += 'Nenhuma peça associada. \n';
        }
        relatorio += '\n';
        relatorio += `Etapas:\n`;
        if (this.aeronave.etapas.length > 0) {
            this.aeronave.etapas.forEach((etapa, index) => {
                relatorio += `\n - ${index + 1}. ${etapa.nome}\n Prazo: ${etapa.prazo} \nStatus: ${etapa.statusE}\n`;
            });
        }
        else {
            relatorio += '   Nenhuma etapa associada\n';
        }
        relatorio += '\n';
        relatorio += `Resultado dos testes:\n`;
        if (this.aeronave.testes.length > 0) {
            this.aeronave.testes.forEach((teste, index) => {
                relatorio += `${index + 1}. ${teste.tipoT}. Resultado: ${teste.resultado}\n`;
            });
        }
        else {
            relatorio += '   Nenhum teste realizado\n';
        }
        return relatorio;
    }
    salvarRelatorio() {
        try {
            const dataDir = 'data';
            if (!fs_1.default.existsSync(dataDir)) {
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            }
            const ArquivoRel = `relatorio_${this.aeronave.modelo}_${this.aeronave.codigo}.txt`;
            const relatorioTexto = this.gerarRelatorio();
            fs_1.default.writeFileSync(path_1.default.join(dataDir, ArquivoRel), relatorioTexto);
            console.log(`Relatório salvo em: data/${ArquivoRel}`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
}
exports.default = Relatorio;
