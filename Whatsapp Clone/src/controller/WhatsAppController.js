import {Format} from './../util/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from '../util/Firebase';
import { User } from '../model/User';

export class WhatsAppController{ // vai exportar essa classe pro app.js 

    constructor() {
        this._firebase = new Firebase();
        this.initAuth()
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
    }

    // método pra iniciar a autenticação do firebase
    initAuth() {
        this._firebase.initAuth()
        .then(response=>{

            this._user = new User(response.user.email);
            // passando o email pro firebase como chave, uma promessa vai ser criada
            // é preciso ter alguma instruçao esperando a resposta (ou nao) dessa promessa

            // mantém "listening" e cria o evento datachange    
            this._user.on('datachange', data=> {
            // onde armazenar quais dados resgatados dessa promise do db
            
            // armazenando o nome do usuario no titulo da pagina 
            document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';

            this.el.inputNamePanelEditProfile.innerHTML = data.name;

            // tratando a foto do usuario
            if (data.photo) {

                // foto do profile da esquerda
                let photo = this.el.imgPanelEditProfile;
                photo.src = data.photo;
                photo.show();

                this.el.imgDefaultPanelEditProfile.hide();

                // foto do profile padrao - sem precisar abrir menus
                let myPhoto = this.el.myPhoto.querySelector('img');
                myPhoto.src = data.photo;
                myPhoto.show();

            }

            // método pra listagem de contatos
            this.initContacts();

            });

            this._user.name = response.user.displayName;
            this._user.email = response.user.email;
            this._user.photo = response.user.photoURL;

            // quando os dados acima estiverem salvos no firebase
            this._user.save().then(()=>{

                // mostra a tela que tava escondida
                this.el.appContent.css({        
                    display:'flex'
                }); 

            });

        }).catch(err=>{ 
            console.error(err);
        });
        
    } // fecha initAuth()

    initContacts(){

    // cria o evento contactschange e recebe o docs
    this._user.on('contactschange', docs=>{
    // primeiro, limpar a lista de contatos
        this.el.contactsMessagesList.innerHTML = ''
    // depois inserir o(s) contato(s) novo(s)
        docs.forEach((doc)=>{
            let contact = doc.data(); // extrai os dados do documento
            let div = document.createElement('div');
            div.className = 'contact-item';
            div.innerHTML = `
                <div class="_1WliW" style="height: 49px; width: 49px;">
                    <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                    <div class="_3ZW2E">
                        <span data-icon="default-user" class="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                <g fill="#FFF">
                                    <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div class="_3j7s9">
                <div class="_2FBdJ">
                    <div class="_25Ooe">
                        <span dir="auto" title=${contact.name} class="_1wjpf">${contact.name}</span>
                    </div>
                    <div class="_3Bxar">
                        <span class="_3T2VG">${contact.lastMessageTime}</span>
                    </div>
                </div>
                <div class="_1AwDx">
                    <div class="_itDl">
                        <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
    
                        <span class="_2_LEW last-message">
                            <div class="_1VfKB">
                                <span data-icon="status-dblcheck" class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                        <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                    </svg>
                                </span>
                            </div>
                            <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                            <div class="_3Bxar">
                                <span>
                                    <div class="_15G96">
                                        <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                    </div>
                            </span></div>
                            </span>
                    </div>
                </div>
        `;

        // verificaçao pra poder trocar a foto

        if (contact.photo) {

            let img = div.querySelector('.photo'); // pega a foto
            img.src = contact.photo; // atribui a foto do contato
            img.show();

        }

        this.el.contactsMessagesList.appendChild(div);

        });
       
    });

    // pega os contatos direto do firebase
    this._user.getContacts();



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

            this.el.btnSavePanelEditProfile.disabled = true;

            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;

            // usando metodo save pra salvar as alteraçoes no firebase
            this._user.save().then(()=>{

                this.el.btnSavePanelEditProfile.disabled = false;
                
            });

        });

        // no submit do formulario faça
        this.el.formPanelAddContact.on('submit', (e)=>{

            e.preventDefault();

            // o construtor do formdata já faz o append - semelhante com o que foi feito no projeto dropbox
            let formData = new FormData(this.el.formPanelAddContact);

            // novo usuario pegando o email dele
            let contact = new User(formData.get('email'));

            // no datachange, passa os dados
            contact.on('datachange', data=>{

                // se recuperou um data.name, já validou o retorno do usuario
                if (data.name) {
                    this._user.addContact(contact).then(()=>{ // recebe a promise do return de addContact

                        this.el.btnClosePanelAddContact.click();
                        console.info('Contato foi adicionado.')

                    });
                } else {
                    console.error('Usuário não foi encontrado.');
                }
            });

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
                height: 'calc(100% - 120px);'
            });
            this.el.inputDocument.click();
        });

        this.el.inputDocument.on('change', (e)=>{

            if (this.el.inputDocument.files.length){

                this.el.panelDocumentPreview.css({
                    height: '1%;'
                });

                let file = this.el.inputDocument.files[0];

                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result=>{

                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        height: 'calc(100% - 120px);'
                    });

                }).catch((err)=>{

                    this.el.panelDocumentPreview.css({
                        height: 'calc(100% - 120px);'
                    });

                    switch (file.type){
                        //case 'application/vnd.ms excel':
                        //case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        case 'image/jpeg': // por motivos de teste (e eu nao ter documento xls salvos no pc do estagio)
                        case 'image/jpg':
                        case 'image/png': 
                        this.el.iconPanelDocumentPreview.className = 'xls'
                        break;

                        default: 
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic'
                        break;
                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
            }
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

            this._microphoneController = new MicrophoneController();

            // quando o audio toca, configurando evento
            this._microphoneController.on('ready', (musica) =>{

                console.log('ready event');

                this._microphoneController.startRecorder();

            });

            this._microphoneController.on('recordtimer', timer=>{

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);

            });

        });

        this.el.btnCancelMicrophone.on('click', (e)=>{
        
            this._microphoneController.stopRecorder();
            this.defaultMicBar();


        });

        this.el.btnFinishMicrophone.on('click', (e)=>{

            this._microphoneController.stopRecorder();
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

    defaultMicBar() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
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
