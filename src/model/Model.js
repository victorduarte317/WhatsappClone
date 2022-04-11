import { ClassEvent } from "../util/ClassEvent";

export class Model extends ClassEvent{
    constructor() {  
        super();
        this._data = {}; // onde os modelos serão guardados

    }

    // método que recebe o JSON e traduz ele
    fromJSON(json) {
        this._data = Object.assign(this._data, json); // assign vai dar um merge nos dois parâmetros
        this.trigger('datachange', this.toJSON());
        // aqui, trigger existe - apesar de nao declarado em Model.js - por conta da extensão de ClassEvent
        // e ele funciona como um alarme
    } 

    // método pra gerar o json
    toJSON() {
        return this._data;
    }
}