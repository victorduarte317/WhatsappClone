export class ClassEvent {

    constructor(){

        this._events = {};

    }

    on (eventName, fn){

        if (!this._events[eventName]) this._events[eventName] = new Array();

        this._events[eventName].push(fn);

    }

    trigger(){

        // converte o metodo nativo arguments pra array
        let args = [...arguments];
        let eventName = args.shift(); // tira o eventName - que é sempre o primeiro parametro - do array

        args.push(new Event(eventName));

        // verifica se já é um array
        if (this._events[eventName] instanceof Array) {

            this._events[eventName].forEach((fn)=>{

                // executa esse codigo
                fn.apply(null, args);

            });

        }
    }

}