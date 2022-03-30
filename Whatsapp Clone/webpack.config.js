// auxiliando o node pra nao se perder nos diretorios

const path = require('path');

// webpack empacota toda a aplicação em arquivos finais - é um bundle

module.exports = {
    // qual o arquivo de entrada
    entry: './src/app.js',

    // como o webpack vai disponibilizar os arquivos depois de empacotar

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '/dist'), // a partir do diretório que o arquivo webpack tá salvo no disco, traz o /dist
        publicPath: 'dist' // pasta publica, de distribuiçao
    }

    // qual o arquivo de saída
}