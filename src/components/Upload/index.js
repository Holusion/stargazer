import {dispatchTask, endTask} from '../../store'
import FormData from 'form-data';
import {HTTPError} from '../../errors/HTTPError'
import React from 'react'

export default function uploader(WrappedComponent, url, componentProps) {
    return class Upload extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showDialog: false
            }
        }

        async sendFile(url, file) {
            const form = new FormData();
            form.append('file', file);
            let options = {
              method: 'POST',
              body: form,
            }

            try {
                return await fetch(`http://${url}/medias`, options);
            } catch(err) {
                throw new HTTPError(`UPLOAD: ${file.path} - ${err.statusCode} - ${err.statusMessage}`, `le fichier existe déjà, veuillez supprimer le médias ${file.name} avant de réessayer`);
            }
        }
        
        async upload(files){
            let res;
            // console.log("files : ",files);
            let taskName = "Uploading"
            dispatchTask(taskName);
            for(let f of files) {
                try{
                    res = await this.sendFile(url, f)
                    endTask(taskName);
                }catch(err){
                    endTask(taskName, err);
                }
                //Emit a change event even if it failed
            }
            // this.dispatchEvent(new Event("change"));
            return res
        }

        showBoxDialog() {
            const fileSelector = document.createElement('input');
            fileSelector.setAttribute('type', 'file');
            fileSelector.setAttribute('multiple', 'multiple');
            fileSelector.addEventListener("change", (evt)=>{
                this.upload(evt.path[0].files);
            })
            fileSelector.click();
        }

        render() {
            return <WrappedComponent {...this.props} {...componentProps} onClick={() => this.showBoxDialog()} />
        }
    }
}