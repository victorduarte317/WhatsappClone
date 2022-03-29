class WhatsAppController{

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

    }

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

    } 

    closeAllLeftPanels() {

        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }

}