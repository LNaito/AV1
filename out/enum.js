"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoTeste = exports.ResultadoTeste = exports.NivelPermissao = exports.StatusEtapa = exports.StatusPeca = exports.TipoPeca = exports.TipoAeronave = void 0;
var TipoAeronave;
(function (TipoAeronave) {
    TipoAeronave["COMERCIAL"] = "Comercial";
    TipoAeronave["MILITAR"] = "Militar";
})(TipoAeronave || (exports.TipoAeronave = TipoAeronave = {}));
var TipoPeca;
(function (TipoPeca) {
    TipoPeca["NACIONAL"] = "Nacional";
    TipoPeca["IMPORTADA"] = "Importada";
})(TipoPeca || (exports.TipoPeca = TipoPeca = {}));
var StatusPeca;
(function (StatusPeca) {
    StatusPeca["EM_PRODUCAO"] = "Em produ\u00E7\u00E3o";
    StatusPeca["EM_TRANSPORTE"] = "Em transporte";
    StatusPeca["PRONTA"] = "Pronta";
})(StatusPeca || (exports.StatusPeca = StatusPeca = {}));
var StatusEtapa;
(function (StatusEtapa) {
    StatusEtapa["PENDENTE"] = "Pendente";
    StatusEtapa["ANDAMENTO"] = "Andamento";
    StatusEtapa["CONCLUIDA"] = "Concluida";
})(StatusEtapa || (exports.StatusEtapa = StatusEtapa = {}));
var NivelPermissao;
(function (NivelPermissao) {
    NivelPermissao["ADMINISTRADOR"] = "Administrador";
    NivelPermissao["ENGENHEIRO"] = "Engenheiro";
    NivelPermissao["OPERADOR"] = "Operador";
})(NivelPermissao || (exports.NivelPermissao = NivelPermissao = {}));
var ResultadoTeste;
(function (ResultadoTeste) {
    ResultadoTeste["APROVADO"] = "Aprovado";
    ResultadoTeste["REPROVADO"] = "Reprovado";
})(ResultadoTeste || (exports.ResultadoTeste = ResultadoTeste = {}));
var TipoTeste;
(function (TipoTeste) {
    TipoTeste["ELETRICO"] = "Eletrico";
    TipoTeste["HIDRAULICO"] = "Hidraulico";
    TipoTeste["AERODINAMICO"] = "Aerodinamico";
})(TipoTeste || (exports.TipoTeste = TipoTeste = {}));
