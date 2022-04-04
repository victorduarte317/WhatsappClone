import { Model } from "./Model";
import { Firebase } from "../util/Firebase";

export class Chat extends Model {
    constructor() {
        super();
    }

    // getters e setters de usuarios e do timestamp
    get users() { this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }

    // método estático pra retornar a coleção dos chats do firebase
    static getRef() {

        return Firebase.db().collection('/chats');
    }

    // método estático pra criação de um novo chat usando dois emails codificados como ids.
    static create(meEmail, contactEmail) {
        return new Promise((s, f)=>{

            let users = {}; // cria o objeto users

            // gera os ids dos emails e aloca dentro de users
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;

            // add vai gerar o id automaticamente dentro da coleção
            Chat.getRef().add({
                users,
                timestamp: new Date()

                // retorna o then caso consiga, e o catch caso dê errado.
            }).then((doc)=>{

                // pega a referencia de chat, pega o doc - que é o que está sendo retornado - cria o id dele e retorna chat numa promessa
                Chat.getRef().doc(doc.id).get().then((chat)=>{

                    s(chat); //se der certo, retorna o chat

                }).catch((err)=>{
                    f(err);
                });

            }).catch((err)=>{
                f(err   );
            }); 

        });
    }

    // metodo estático pro retorno da busca dos dois emails codificados;
    static find(meEmail, contactEmail) {

        // where recebe tres parametros: quem é a chave procurada, a comparação e o valor comparado.
        return Chat.getRef()
        .where(btoa(meEmail), '==', true)
        .where(btoa(contactEmail), '==', true)
        .get();
        // o where aqui vai fazer a busca dos dois ids em base64, encontrando o chat.
    }

    // passa a informação do email do usuário e email do contato pra pegar qual o chat que tem esses dois usuários como "users".
    static createIfNotExists(meEmail, contactEmail) {

        return new Promise((s, f)=>{

            Chat.find(meEmail, contactEmail).then((chats) => { // método que vai procurar se a conversa existe, buscando pelos dois emails, tratando chats como uma coleçao de informaçoes

                if (chats.empty) {

                    //se der certo retorna o chat e resolve
                    Chat.create(meEmail, contactEmail).then((chat)=>{

                        s(chat);

                    });

                } else {

                    // percorre a lista de chats
                    chats.forEach((chat)=>{
                        s(chat); // retorna o chat
                    });
                }

            }).catch((err)=>{

                f(err);

            });


        });

    }
}
