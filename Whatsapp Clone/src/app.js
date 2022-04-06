// agora usando o webpack, é preciso importar e exportar os arquivos pra que ele funcione.
import {WhatsAppController} from './controller/WhatsAppController'; // importa de whatsappcontroller

window.app = new WhatsAppController();
// coloca no window pra ser acessado pelo console

// cada classe que você cria, você exporta
// toda classe que você usa, você importa