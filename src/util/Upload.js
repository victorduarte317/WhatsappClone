import { Firebase } from "./Firebase";

export class Upload {

    static send(file, from) {

        return new Promise ((s, f)=>{

            //upload do arquivo pro firebase storage
            // referencia é o caminho do arquivo dentro do storage
            // o put vai retornar um uploadTask
            let uploadTask = Firebase.hd().ref(from).child(Date.now() + '_' + file.name).put(file);
    
            // pra checar o upload do arquivo. Daria pra fazer uma barrinha carregando igual o projeto do DropBox
            uploadTask.on('state_changed', e => {
    
                // console.info('upload', e);
    
            }, err => {
                f(err)
            }, () => { // se der certo, quando terminar de fazer o upload
    
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => { // passa a URL da imagem no conteudo
                    
                    s(downloadURL);
                });
            
            });
    
        });

    } 
    
}