// métodos estáticos

export class Format {
    static getCamelCase(text) {

    // temos como funçao nativa do javascript formatar o dataset pra camelCase.
    // porém, pra utilizar essa funçao, é preciso ter um elemento HTML - não precisa ser renderizado, mas precisa existir.
    // então, é preciso criar uma div com o único intuito de gerar o dataset e, desse dataset, fazer a recuperação dele pra js.

        let div = document.createElement('div')

        div.innerHTML = `<div data-${text}="id"></div>`;

        // retornando o dataset com um método nativo do javaScript.
        // Object.keys() vai percorrer um objeto determinado e retornar um array de todas as chaves dele.
        // aqui, ele vai pegar o elemento div, pegar o firstChild - que é o div criado acima e retornar um array de dataset
        // porém, como ele só deve retornar um, o [0] determina isso.
        return Object.keys(div.firstChild.dataset)[0];
    }

    static toTime(duration) {

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {

            // padstart passa 2 casas e completa elas com 0
            return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

    }
    
    static dateToTime(date, locale = 'pt-br') {

        return date.toLocaleTimeString(locale, {

            hour: '2-digit',
            minute: '2-digit'

        });
    }

    static timeStampToTime(timeStamp) {

        // se o timeStamp do firebase existir e tiver uma função "toDate" , retorna a formatação. Se não, não retorna hora nenhuma.
        return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : ''

    }
}
