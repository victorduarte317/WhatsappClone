import {ClassEvent} from "../util/ClassEvent";

// extends é o conceito de herança, onde microphonecontroller vai herdar métodos e objetos de classEvent
export class MicrophoneController extends ClassEvent {

    // esse código difere da forma que o curso fez já que eles utilizaram funções ultrapassadas.
    // doc da versão atualizada: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    constructor(audioEl) {

        super(); // herda efetivamente

        // mimeType é, por exemplo, "audio/mp3" ou "application/PDF". O padrão tem que ser webm já que é amplamente suportado
        this._mimeType = 'audio/webm';

        this._available = false;

        this._audioEl = audioEl;
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this._available = true;

            this._stream = stream;

            // aqui ficou ready já que é preciso saber quando a promise vai retornar stream no WhatsappController
            this.trigger('ready', this._stream);
            
        }).catch(err => {
            console.error(err);
        });
    }

    // método pra checar a disponibilidade da gravação - ou seja, checar se o usuario permitiu o acesso ou nao.
    isAvailable() {
        return this._available; 
    }

    stop() {

        this._stream.getTracks().forEach((track)=>{

            track.stop();

        });
    }

    startRecorder(){

        if (this.isAvailable()) {

            // qual o stream (audio, de certa forma) que vai ser gravado
            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimetype: this._mimeType
            });

            // metodo grava o audio secionado
            // entao, pra gravar essa informaçao, vai ser criado um array e ele vai recebendo push conforme as informaçoes sao gravadas e recebidas

            // cria o array dos pedaços gravados
            this._recordedChunks = [];

            // criando um evento que vai ouvindo e captando esses dados (chunks gravados)
            this._mediaRecorder.addEventListener('dataavailable', (e)=>{
            
                // se for maior que 0, então algo foi recebido.
                if (e.data.size > 0) this._recordedChunks.push(e.data);
                // e se foi recebido, um push dessa informação vai ser executado.

            });

            // configurando o que vai ser feito quando a gravação parar

            this._mediaRecorder.addEventListener('stop', (e)=>{

                // criando o blob e passando o arquivo que vai ser interpretado por ele
                let blob = new Blob(this._recordedChunks, {
                    
                    // informa que o tipo dele vai ser o mesmo tipo da gravação (nesse caso, 'audio/webm', definido lá em cima)
                    type: this._mimeType

                });
            
                
                // concatenaçao via template string
                let filename = `rec${Date.now()}.webm`;

                let audioContext = new AudioContext();

                let reader = new FileReader();

                reader.onload = (e)=>{

                    audioContext.decodeAudioData(reader.result).then((decode)=>{

                        // esse arquivo precisar ser binário pra ser interpretado
                        // então é preciso utilizar o blob (binary large object)
                        // o blob vai compactar todas as seções gravadas e transformar em um arquivo com informações (tipo, etc)
                        // e só então o recordedChunks vai ser lido por file e interpretado como um arquivo.

                        // transformando o recordedChunks em um arquivo
                        let file = new File([blob], filename, { // tudo dentro dessa chave sao parametros
                        type: this._mimeType,
                        lastModified: Date.now()

                    });

                    this.trigger('recorder', file, decode);

                    
                });

            }

                reader.readAsArrayBuffer(blob);

                // usando FileReader pra ouvir o áudio gerado
                /* let reader = new FileReader();

                reader.onload = (e) =>{
                    console.log('reader file', file)
                    let audio = new Audio(reader.result);
                    audio.play();
                }

                reader.readAsDataURL(file);
                */
            });
            

            this._mediaRecorder.start();
            this.startTimer();
        }

    }

    stopRecorder(){

        if (this.isAvailable()){

            // para de gravar o audio do microfone
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
            // para de reproduzir o audio do microfone
        }
    }


        // trazendo alguns códigos de WhatsapController pra cá  
        // visando melhor organização do código

        startTimer() { 

            let start = Date.now(); 

            // variavel privada recebe setInterval - metodo nativo do js
            this._recordMicrophoneInterval = setInterval(()=>{

            this.trigger('recordtimer', (Date.now() - start));

        }, 100); // a cada 100ms
        
    }

    stopTimer(){

        clearInterval(this._recordMicrophoneInterval);
    }
}