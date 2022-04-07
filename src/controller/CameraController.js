export class CameraController {

    constructor(videoEl) { // construtor recebe - do whatsappcontroller - o elemento de video da pagina

        this._videoEl = videoEl;

        // acessa a midia do usuario - gera um requirement de permissão
        navigator.mediaDevices.getUserMedia({
            video: true // captura o video
        }).then(stream=>{ // retorna o promise, se for sucesso passa o stream do video

            let mediaStream = new MediaStream(stream);
            // cria uma URL que o video vai conseguir ler a partir de stream
            this._stream = stream;
            this._videoEl.srcObject = mediaStream;
            this._videoEl.play(); // força o play

        }).catch(err=>{
            console.error(err); 
        });

    }

    stop() { // método pra câmera parar de capturar imagem

        this._stream.getTracks().forEach(track=>{ // getTracks pega as trilhas de áudio/vídeo, pra cada track faça
            track.stop(); // para a track
        });
    }

    takePicture(mimeType = 'image/png') {

        // canvas vai criar uma paleta - uma area pra desenho
        let canvas = document.createElement('canvas');

        canvas.setAttribute('height', this._videoEl.videoHeight); // definindo altura e largura de acordo com o atributo do video
        canvas.setAttribute('width', this._videoEl.videoWidth);

        let context = canvas.getContext('2d'); // como é uma foto, é 2d mesmo

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height); 
        // vai desenhar essa imagem pegando ela de videoEl, 0 no x e y pra começar do top left e vai preencher
        // a largura e altura do canvas criado

        return canvas.toDataURL(mimeType);
    }

}