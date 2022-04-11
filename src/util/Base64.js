export class Base64 {
    static getMimetype(urlBase64) {

        let regex = /^data:(.+);base64,(.*)$/  // expressão regular. Começa em ^, termina em $. Ou seja, começa em image/png, termina em base64
            // vai procurar essa expressao dentro do regex

        let result = urlBase64.match(regex); // result vai fazer a busca por meio do match, que vai procurar o regex.
        return result[1]; // o mimeType vai pegar o tipo do arquivo, image/png

    }

    static toFile(urlBase64) {

        let mimeType = Base64.getMimetype(urlBase64);

        let ext = mimeType.split('/')[1] // a extensão vai dar split no mimetype e pegar só "png"

        let filename = `file${Date.now()}.${ext}`; // filename vai pegar a data de agora

        return fetch(urlBase64)
            .then(res => { return res.arrayBuffer(); })
                .then(buffer => { return new File([buffer], filename, { type: mimeType }) });
    }

}