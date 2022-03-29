// métodos estáticos

class Format {
    static getCamelCase(text) {

    // temos como funçao nativa do javascript formatar o dataset pra camelCase.
    // porém, pra utilizar essa funçao, é preciso ter um elemento HTML - não precisa ser renderizado, mas precisa existir.
    // então, é preciso criar uma div com o único intuito de gerar o dataset e, desse dataset, fazer a recuperação dele pra js.

        let div = document.createElement('div')

        div.innerHTML = `<div data-${text}='id'></div>`;

        // retornando o dataset com um método nativo do javaScript.
        // Object.keys() vai percorrer um objeto determinado e retornar um array de todas as chaves dele.
        // aqui, ele vai pegar o elemento div, pegar o firstChild - que é o div criado acima e retornar um array de dataset
        // porém, como ele só deve retornar um, o [0] determina isso.
        return Object.keys(div.firstChild.dataset)[0];
    }
}