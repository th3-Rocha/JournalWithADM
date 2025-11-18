import { Editor } from '@tinymce/tinymce-react';
import Cookies from 'js-cookie';

interface EditorProps {
  initialValue: string;
  value: string;
  setValue(value: string): void;
}

export const EditorText = ({ value, initialValue, setValue }: EditorProps) => {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_API_KEY_TINYMCE}
      initialValue={initialValue}
      value={value}
      onEditorChange={(newValue) => setValue(newValue)}
      init={{
        width: '100%',
        height: 500,
        max_height: 500,
        menubar: 'file edit insert tools view format',
        image_uploadtab: true,
        image_advtab: true,
        images_upload_handler: async function (blobInfo, success, failure) {
          
          const bearerToken = Cookies.get('nextauth.token');

          let file = blobInfo.blob()
          var form = new FormData()
          form.append("file", file)
          fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/image/upload', {
            method: 'POST',
            body: form,
            headers: {
              'Authorization': 'Bearer ' + bearerToken
           },
          })
            .then(function (response) {

        
              if (response.status === 201) {                
                response.json().then(function (data) {
                  
                  success(data.url);
                });
              } else {
                failure('Erro ao enviar a imagem');
              }
            })
            .catch(function () {
              failure('Erro ao enviar a imagem');
            });
        },
        file_picker_types: 'image',
        autoresize_bottom_margin: 50,
        plugins: [
          'fullscreen autoresize image code advlist lists link charmap print preview anchor',
          'searchreplace visualblocks',
          'insertdatetime media table paste help wordcount',
        ],
        toolbar:
          'formatselect | bold italic backcolor forecolor |' +
          'alignleft aligncenter alignright alignjustify |' +
          'bullist numlist outdent indent | fullscreen help',
        content_style:
          'body { visibility: visible, font-family:Roboto,Helvetica,Arial,sans-serif; font-size:16px }',
      }}
    />
  );
};

