// classe pra tratamento de eventos
export class ClassEvent {

    constructor() {
        // eventos recebem array vazio
        this._events = {};

    }
    // cria o metodo on passando o nome do evento (sempre em primeiro) e a funçao
    on(eventName, fn) {
        // se nao tiver um eventName, vai receber um array
        if(!this._events[eventName]) this._events[eventName] = new Array();

        // e o push da funçao. O intuito é que, se tiver mais de uma função ao mesmo tempo, por exemplo
        // em uma é executado console.log(a) e, em outra, console.log(b). Elas não podem se sobrescrever.
        // aqui, a função ta sendo adicionada ao array
        this._events[eventName].push(fn);

    }

    trigger() {

        // converte o metodo nativo arguments pra array
        let args = [...arguments];
        let eventName = args.shift() // tira o eventName - que é sempre o primeiro parametro - do array

        args.push(new Event(eventName));

        // verifica se já é um array
        if(this._events[eventName] instanceof Array) {

            this._events[eventName].forEach(fn => {

                // executa esse codigo
                fn.apply(null, args);

            });

        }
    }

}