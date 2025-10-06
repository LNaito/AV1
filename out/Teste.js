"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Teste {
    constructor(tipoT, resultado) {
        this.tipoT = tipoT;
        this.resultado = resultado;
    }
    //== Métodos (Salvar e Carregar)
    salvarTeste() {
        try {
            if (!fs_1.default.existsSync('data')) {
                fs_1.default.mkdirSync('data');
            }
            const dados = {
                tipo: this.tipoT,
                resultado: this.resultado,
                data: new Date().toISOString()
            };
            const nomeArquivo = `teste_${this.tipoT}_${Date.now()}.json`;
            fs_1.default.writeFileSync(`data/${nomeArquivo}`, JSON.stringify(dados, null, 2));
            console.log(`Teste salvo com sucesso!`);
        }
        catch (error) {
            console.error('Erro:', error);
        }
    }
    //a fazer
    carregarTeste(nomeArquivoTeste) {
        try {
            const arquivo = `data/${nomeArquivoTeste}`;
            if (fs_1.default.existsSync(arquivo)) {
                const dados = JSON.parse(fs_1.default.readFileSync(arquivo, 'utf8'));
                this.tipoT = dados.tipo;
                this.resultado = dados.resultado;
                console.log(`Teste carregado com sucesso!`);
            }
            else {
                console.log('Arquivo não encontrado, verifique e tente novamente.');
            }
        }
        catch (error) {
            console.error(' Erro:', error);
        }
    }
    executarTeste() {
        console.log(`🔧 Executando teste ${this.tipoT}...`);
        // Simulação de teste - em sistema real teria lógica específica
        setTimeout(() => {
            console.log(`✅ Teste ${this.tipoT} concluído! Resultado: ${this.resultado}`);
        }, 1000);
    }
}
exports.default = Teste;
