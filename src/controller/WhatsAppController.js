import {Format} from './../util/Format';
import {CameraController} from './CameraController';

export class WhatsAppController{ // vai exportar essa classe pro app.js 

    constructor() {
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
    }

    loadElements() {

        // a ideia é poder acessar esse objeto aqui embaixo com a sintaxe "this.el" e o nome em camelCase 
        // do ID retornado pelo forEach.

        this.el = {};

        // forEach vai pegar elemento por elemento - que possuem ID - de dentro do documento.
        document.querySelectorAll('[id]').forEach((element)=>{

            // o objeto vai receber o nome do id - formatado pela classe Format pra camelCase - e o elemento.
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }

    // Prototype é uma forma de alterar uma classe e passar essa alteração pra todos os objetos 
    // que instanciam tal classe
    elementsPrototype() {

        // Informa a classe que vai sofrer o prototype - as alterações nos objetos instanciadores dele.
        // nesse caso, vai ser a classe nativa Element

        // aqui é usado function pra encapsular as instruções ali dentro. Com arrow function dá pra fazer, mas daria mais trabalho.

        Element.prototype.hide = function(){ 

            // o this aqui é referente ao objeto que receber "hide"
            this.style.display = 'none';
            return this;
            // o elemento precisa ser retornado para que, se for preciso adicionar uma classe depois da outra
            // por exemplo: app.el.app.hide().addClass(), o addClass() consiga executar em cima desse elemento.
        }

        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function(){
            // verificação, se o display do objeto for none ele aparece. Se não for none, agora é.
            // if ternário
            this.style.display = (this.style.display ==='none') ? 'block' : 'none';
            return this;
        }

        // criar um método on pra varios eventos executarem uma funçao. Recebe os eventos e a função.
        Element.prototype.on = function(events, fn) {

            // como ele vai receber uma string separando os eventos por espaço, é preciso fazer um split
            // em events, pra ele dividir toda vez que tiver um espaço.

            events.split(' ').forEach(event=>{

                // enquanto houverem eventos, o laço vai se repetir
                this.addEventListener(event, fn);
            });
                return this;

        }

        Element.prototype.css = function(styles) {
            // pra cada nome que existir em styles execute 
            for (let name in styles) {
                // esse elemento vai ter name - passado no forIn - igual ao nome dos styles do css.
                this.style[name] = styles[name];
                return this;
            }

        }

        // pra mudar a classe, a funçao recebe o nome da classe
        Element.prototype.addClass = function(name) {
            // e o elemento recebe a classe com o nome passado
            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name) {

            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name) {
            
            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function(name) {
            
            // contains retorna true ou falso, se o elemento tem a classe nome retorna true, se não, false.
           return this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function() {

            return new FormData(this);

        }

        // FormData é muito util pra enviar informações via AJAX, mas aqui o intuito é gravar as informaçoes no firebase
        // Então, é melhor converter as informações pra JSON
        HTMLFormElement.prototype.toJSON = function() {

            let json = {};

            // forEach dentro do formulario retornado passando value e key
            this.getForm().forEach((value, key)=>{

                json[key] = value;

            });

            return json;

        }

    } // fecha elementsPrototype

    initEvents() {

        this.el.myPhoto.on('click', e=>{

            this.closeAllLeftPanels();
            // é importante dar o show pq a classe closeAllLeftPanels vai esconder quem tiver com show.
            // css tem uma classe pra abrir os menus
            this.el.panelEditProfile.show();
            setTimeout(()=>{
                this.el.panelEditProfile.addClass('open');
            }, 300);

        });

        this.el.btnNewContact.on('click', e=>{

            this.closeAllLeftPanels();
            this.el.panelAddContact.show();
            setTimeout(()=>{
                this.el.panelAddContact.addClass('open');
            }, 300); // como o css nao ta tendo tempo pra fazer a animaçao de deslizar, é preciso setar
                    // um delay de 300ms.
    
        }); 

        this.el.btnClosePanelEditProfile.on('click', e=>{
            
            this.el.panelEditProfile.removeClass('open');
        })

        this.el.btnClosePanelAddContact.on('click', e=>{

            this.el.panelAddContact.removeClass('open');

        });

        this.el.photoContainerEditProfile.on('click', (e)=>{

            // por padrao, campos de input - quando clicados - abrem a janela de upload do sistema operacional
            // entao, aqui forçamos esse click pra simular esse evento
            this.el.inputProfilePhoto.click();

        });

        // keypress = quando digitar
        this.el.inputNamePanelEditProfile.on('keypress', (e) =>{

            if (e.key ==='Enter')  {


                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }

        }); 

        this.el.btnSavePanelEditProfile.on('click', (e)=>{

            console.log(this.el.inputNamePanelEditProfile.innerHTML);

        });

        // no submit do formulario faça
        this.el.formPanelAddContact.on('submit', (e)=>{

            e.preventDefault();

            // o construtor do formdata já faz o append - semelhante com o que foi feito no projeto dropbox
            let formData = new FormData(this.el.formPanelAddContact);

        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{

            item.on('click', e=>{

                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                })

            });

        });

        this.el.btnAttach.on('click', (e)=>{

            e.stopPropagation(); // impede que o evento seja disparado pros elementos ancestrais dele.
            this.el.menuAttach.addClass('open');
            // depois que o usuario clicar em algum lugar, seja em um dos botoes que apareceu no menu
            // ou fora da tela, o menu precisa fechar. É complicado já que a função de fechar é anônima 
            // não apresentando nenhuma forma de ser referenciada. Então, é preciso criar um método pra 
            // "dar um nome" pra essa função, e aqui é o closeMenuAttach.
            document.addEventListener('click', this.closeMenuAttach.bind(this));
            // sem o bind, o código estava identificando "this" como document, e nao mais como WhatsAppController.
            // então, o bind serviu pra vincular o this e manipular o escopo dele de acordo com a necessidade.
        });

        this.el.btnAttachPhoto.on('click', (e)=>{

            this.el.inputPhoto.click();

        });

        this.el.inputPhoto.on('change', (e)=>{

            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file=>{

                console.log(file);

            });

        });

        this.el.btnAttachCamera.on('click', (e)=>{

            this.closeAllMainPanels();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height':'calc(100% - 120px);'
            });

            this._camera = new CameraController(this.el.videoCamera);

        });

        this.el.btnClosePanelCamera.on('click', (e)=>{

            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
            this._camera.stop();

        });

        this.el.btnTakePicture.on('click', (e)=>{

            let dataUrl = this._camera.takePicture();

            this.el.pictureCamera.src= dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();

        });

        this.el.btnReshootPanelCamera.on('click', (e)=>{

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();

        });

        this.el.btnSendPicture.on('click', (e)=>{

            console.log(this.el.pictureCamera.src);

        });

        this.el.btnAttachDocument.on('click', (e)=>{

            this.closeAllMainPanels();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height':'calc(100% - 120px);'
            });
            this.el.inputDocument.click();
        });

        this.el.btnClosePanelDocumentPreview.on('click', (e)=>{

            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();

        });

        this.el.btnSendDocument.on('click', (e)=>{

            console.log('document sent');

        });

        this.el.btnAttachContact.on('click', (e)=>{

            this.el.modalContacts.show();

        });

        this.el.btnCloseModalContacts.on('click', (e)=>{

            this.el.modalContacts.hide();   
        }); 

        this.el.btnSendMicrophone.on('click', (e)=>{

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();
            this.startRecordMicrophoneTimer();

        });

        this.el.btnCancelMicrophone.on('click', (e)=>{
        
            this.defaultMicBar();


        });

        this.el.btnFinishMicrophone.on('click', (e)=>{

            this.defaultMicBar();  

        });

        // no pressionar da tecla, passa o evento
        this.el.inputText.on('keypress', (e)=>{

            // se a tecla pressionada no evento for enter sem control
            if (e.key === 'Enter' && !e.ctrlKey){
            
                // previne o tratamento padrao de enter (pulo de linha)
                e.preventDefault();
                // chama btnSend e força o evento que ocorre no click do metodo
                this.el.btnSend.click(); 
            }

        });

        this.el.inputText.on('keyup', (e)=>{

            // isso vai checar se o elemento tem uma length e, como quando o inputText fica vazio o HTML envia uma
            // tag <br> (justamente pra não deixar vazio), checa se o conteudo nao é <br> tambem
            if (this.el.inputText.innerHTML && this.el.inputText.innerHTML != '<br>') {
     
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
     
            } else {
     
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();            
     
            }

        });

        this.el.btnSend.on('click', (e)=>{

            console.log(this.el.inputText.innerHTML);

        });
    

         

        this.el.btnEmojis.on('click', (e)=>{

            this.el.panelEmojis.toggleClass('open');

        });


        this.el.panelEmojis.querySelectorAll(".emojik").forEach(emoji=>{

            emoji.on('click', e=>{

                console.log(emoji.dataset.unicode);

                // cloneNode é um método nativo do JS que permite a clonagem de um elemento e a captura de
                // alguns elementos específicos durante esse processo.
                // esse elemento precisa ser clonado já que é impossível fazer o append dele mais de uma vez
                // tendo em vista que é um ID e que, depois do primeiro append, ele já vai ter sido movido
                // então o id deixaria de existir.
                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;   
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                // pra cada classe de emoji faça
                emoji.classList.forEach(name=>{

                    // toda classe CSS que tiver dentro de emoji vai pra dentro da variavel IMG tambem.
                    img.classList.add(name);

                });

                // vai pegar a posição do cursor do teclado
                let cursor = window.getSelection();

                // focusNode.id vai verificar se o cursor tá posicionado no id 'input-text'
                // o if diz: se o cursor não estiver focado em nada OU estiver focado em algo que NÃO SEJA 
                // 'input-text', então foca em input-text
                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {

                    this.el.inputText.focus();
                    // então, se o cursor não estiver focado em input-text, agora ele vai focar

                    cursor = window.getSelection();
                    // aqui o cursor é recriado - agora com o foco em input-text.
                }

                // criando o controle dos intervalos, range seria aonde o cursor tá posicionado em relação
                // ao texto. A propriedade range em si vai ser o index de elementos selecionados pelo cursor
                let range = document.createRange(); 

                // retorna a posição atual do cursor
                range = cursor.getRangeAt(0); // (o) aqui significa o ponto de início, onde começou a selecionar
                range.deleteContents();
                // agora, se um range de caracteres for selecionado e um emoji for clicado, o emoji substitui.

                let frag = document.createDocumentFragment(); // cria um fragmento - uma seção - do documento
                frag.appendChild(img); // coloca a imagem clonada (imagem do emoji) dentro dessa seção

                range.insertNode(frag); // insere o fragmento no range, inserindo efetivamente o emoji

                range.setStartAfter(img); // joga o cursor pra depois do emoji

                // como o placeholder só some com um conteúdo lá dentro, aqui o evento keyup é forçado
                // em prol de tirar o placeholder do inputText.
                this.el.inputText.dispatchEvent(new Event('keyup'));

            });

        });



        

    } // fecha initEvents

    // método pra colocar o timer dos audios do whatsapp
    startRecordMicrophoneTimer(){

        let start = Date.now(); 

        // variavel privada recebe setInterval - metodo nativo do js
        this._recordMicrophoneInterval = setInterval(()=>{

            this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);

        }, 100); // a cada 100ms
    }

    defaultMicBar() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
        clearInterval(this._recordMicrophoneInterval);

    }

    closeAllMainPanels() {

        this.el.recordMicrophone.hide();
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');

    }


    closeMenuAttach(e){

        // remove o evento click do closeMenuAttach
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }   

    closeAllLeftPanels() {

        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }

}