import { Firebase } from '../util/Firebase'
import { Model } from './Model';

export class User extends Model {

    constructor(id) {
        super(); // como é extensão de classEvent, é preciso chamar seu construtor
        if(id) this.getById(id); // se for passado o id, carrega ele
    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }
    
    getById(id) {

        return new Promise((s, f)=>{

            // o email é o id
            // essa promessa retorna o documento salvo no firebase
            User.findByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data());

                s(doc);

            })
        
        })
    }

    // método que vai salvar os dados no firebase

    save() {

        return User.findByEmail(this.email).set(this.toJSON());

    }

    static getRef() {

        // retorna o a coleção users do banco de dados.
        // retorna a referencia pra usuarios, que vai ser usado toda vez que alguma alteração nos usuários precisar ser feita.
        return Firebase.db().collection('/users');

    }
    
    static getContactsRef(id) {

        return User.getRef() // pega a referencia do usuario
                .doc(id) // pega o documento
                .collection('contacts') // pega a coleçao do documento

    }

    // método estático pra realizar buscas - recebe como parametro o email do usuario
    static findByEmail(email) {

        // dentro da coleção users, retorna o documento com o id 'email'
        return User.getRef().doc(email);
    }

    addContact(contact) {

        // é necessário usar uma função que converta o contact.email pra b64 já que, pra tratar a informação do email
        // com caracteres especiais - como o @ - vai ser complicado.
        return User.getContactsRef(this.email) // pega a referencia, retorna a promessa do set
            .doc(btoa(contact.email)) // pega o email do contato e transforma em base64
            .set(contact.toJSON()); // usa o set pra salvar o contato - passando um objeto
    }

    getContacts(filter = '') { // pode ser que receba um filtro ou nao, ou seja, pode ser que o usuario digite lá ou nao.
        return new Promise((s, f) => { 

            // o snapshot pra manter a ouvidoria, o where pra verificação e filtro do nome
            User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {
                let contacts = []; // array dos contatos
                docs.forEach(doc => { // forEach pra povoar os contatos
                    let data = doc.data(); 

                    data.id = doc.id;

                    contacts.push(data);

                });

                // como a ouvidoria é mantida por snapshots, se algum método precisa
                // do retorno de docs, trigger vai avisar sempre que houver uma troca de contatos
                this.trigger('contactschange', docs);
                s(contacts);

            });

        });
    }
}
