const firebase = require('firebase')
require('firebase/firestore')

export class Firebase {

    constructor() {
        this._config = {

            apiKey: "AIzaSyDxyIXUvj6poJRgqJ5gVHmeLHVW-jw0BZQ",
        
            authDomain: "whatsapp-clone-fc85a.firebaseapp.com",
        
            projectId: "whatsapp-clone-fc85a",
        
            storageBucket: "whatsapp-clone-fc85a.appspot.com",
        
            messagingSenderId: "326937774207",
        
            appId: "1:326937774207:web:e5d5ce9b2478a8ca96974a",
        
          };

        this.init();
    }
    
    init() {

        // troca de "this" pra "window" para que initialized seja global, já que se continuasse em "this"
        // um ia retornar true e outro false, acabando com a autenticação
        if (!window._initializedFirebase) {

            firebase.initializeApp(this._config);

            firebase.firestore().settings({})
        
            window._initializedFirebase = true;
        }
        
    }

    static db() {

        return firebase.firestore();
    }

    static hd() {

        return firebase.storage();
    }

    initAuth(){

        return new Promise((s,f)=>{

            // cria o provider
            let provider = new firebase.auth.GoogleAuthProvider();

            // método gera um popup com o provider que o usuario pode utilizar.
            firebase.auth().signInWithPopup(provider)
            .then(result =>{

                // token vai armazenar os dados de um usuario autenticado. Usado como medida de segurança pra identificar e autenticar um usuario.
                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    user,
                    token
                });

            })
            .catch(err=> {
                f(err);
            })

        });

    }

}