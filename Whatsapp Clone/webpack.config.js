// auxiliando o node pra nao se perder nos diretorios

const path = require('path');

// webpack empacota toda a aplicação em arquivos finais - é um bundle

module.exports = {
    // qual o arquivo de entrada
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },


    // como o webpack vai disponibilizar os arquivos depois de empacotar

    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist'), // a partir do diretório que o arquivo webpack tá salvo no disco, traz o /dist
        publicPath: 'dist' // pasta publica, de distribuiçao
    }

    // qual o arquivo de saída
}
