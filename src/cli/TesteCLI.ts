import inquirer from "inquirer";
import Teste from "../Teste";
import { TipoTeste, ResultadoTeste } from "../enum";
import fs from 'fs';
import path from 'path';

export class TesteCLI {
    static testes: Teste[] = [];
    private static readonly DATA_FILE = 'data/testes.json';

    static salvarTestes(): void {
        try {
            const dataDir = path.dirname(this.DATA_FILE);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

            const dadosSerializaveis = this.testes.map(teste => ({
                tipo: teste.tipoT,
                resultado: teste.resultado
            }));

            fs.writeFileSync(this.DATA_FILE, JSON.stringify(dadosSerializaveis, null, 2));
            console.log(`${this.testes.length} teste(s) salvo(s) com sucesso em ${this.DATA_FILE}!`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    static carregarTestes(): void {
        try {
            if (!fs.existsSync(this.DATA_FILE)) {
                console.log('Nenhum arquivo de testes encontrado.');
                return;
            }

            const dados = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));
            this.testes = dados.map((dado: any) => new Teste(dado.tipo, dado.resultado));

            console.log(`✅ ${this.testes.length} teste(s) carregado(s) com sucesso!`);
        } catch (error) {
            console.error('Erro ao carregar testes:', error);
        }
    }

    static async cadastrarTeste(): Promise<void> {
        const dados = await inquirer.prompt([
            { type: 'list', name: 'tipo', message: 'Qual o tipo do teste? ', choices: Object.values(TipoTeste) },
            { type: 'list', name: 'resultado', message: 'Qual o resultado do teste? ', choices: Object.values(ResultadoTeste) }
        ]);

        const teste = new Teste(dados.tipo, dados.resultado);
        this.testes.push(teste);
        console.log('Teste cadastrado com sucesso!');
    }

    static async listarTestes(): Promise<void> {
        if (this.testes.length === 0) {
            console.log('Nenhum teste cadastrado.');
            return;
        }

        console.log('\n== LISTA DE TESTES ==');
        this.testes.forEach((teste, index) => {
            console.log(`${index + 1}. ${teste.tipoT} - Resultado: ${teste.resultado}`);
        });
    }

    static async executarTeste(): Promise<void> {
        if (this.testes.length === 0) {
            console.log('Nenhum teste disponível para executar.');
            return;
        }

        const { indice } = await inquirer.prompt([{
            type: 'list',
            name: 'indice',
            message: 'Selecione o teste para executar:',
            choices: this.testes.map((teste, index) => ({ name: `${teste.tipoT} - ${teste.resultado}`, value: index }))
        }]);

        const testeSelecionado = this.testes[indice];
        testeSelecionado.executarTeste();
    }

    static async show(): Promise<void> {
        let sair = false;
        while (!sair) {
            const { acao } = await inquirer.prompt([{
                type: 'list',
                name: 'acao',
                message: '== Menu Testes ==',
                choices: [
                    'Cadastrar Novo Teste',
                    'Listar Todos Testes',
                    'Executar Teste',
                    'Salvar Testes',
                    'Carregar Testes',
                    'Voltar'
                ]
            }]);

            switch (acao) {
                case 'Cadastrar Novo Teste': await this.cadastrarTeste(); break;
                case 'Listar Todos Testes': await this.listarTestes(); break;
                case 'Executar Teste': await this.executarTeste(); break;
                case 'Salvar Testes': this.salvarTestes(); break;
                case 'Carregar Testes': this.carregarTestes(); break;
                case 'Voltar': sair = true; break;
            }
        }
    }
}
