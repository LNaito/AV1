import { ResultadoTeste, TipoTeste } from "./enum"
import fs from 'fs'

export default class Teste {
    tipoT: TipoTeste
    resultado: ResultadoTeste

    constructor(tipoT: TipoTeste, resultado: ResultadoTeste){
        this.tipoT = tipoT
        this.resultado = resultado
    }

    //== Métodos (Salvar e Carregar)
    public salvarTeste(){
        try {
            if (!fs.existsSync('data')) {
                fs.mkdirSync('data')
            }

            const dados = {
                tipo: this.tipoT,
                resultado: this.resultado,
                data: new Date().toISOString()
            }

            const nomeArquivo = `teste_${this.tipoT}_${Date.now()}.json`;
            fs.writeFileSync(`data/${nomeArquivo}`, JSON.stringify(dados, null, 2));
            console.log(`Teste salvo com sucesso!`)
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    //a fazer
    carregarTeste(nomeArquivoTeste: string): void {
        try {
            const arquivo = `data/${nomeArquivoTeste}`;
            
            if (fs.existsSync(arquivo)) {
                const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
                
                this.tipoT = dados.tipo;
                this.resultado = dados.resultado;
                
                console.log(`Teste carregado com sucesso!`);
            } 
            
            else {
                console.log('Arquivo não encontrado, verifique e tente novamente.');
            }
        } catch (error) {
            console.error(' Erro:', error);
        }
    }

    executarTeste(): void {
        console.log(`🔧 Executando teste ${this.tipoT}...`);
        // Simulação de teste - em sistema real teria lógica específica
        setTimeout(() => {
            console.log(`✅ Teste ${this.tipoT} concluído! Resultado: ${this.resultado}`);
        }, 1000);
    }

}
