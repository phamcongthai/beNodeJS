"use strict";

tinymce.init({
  selector: 'textarea#desc',
  plugins: 'image code',
  toolbar: 'undo redo | link image | code',

  /* enable title field in the Image dialog*/
  image_title: true,

  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,

  /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
  file_picker_types: 'image',

  /* and here's our custom image picker*/
  file_picker_callback: function file_picker_callback(cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        var id = 'blobid' + new Date().getTime();
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        /* call the callback and populate the Title field with the file name */

        cb(blobInfo.blobUri(), {
          title: file.name
        });
      });
      reader.readAsDataURL(file);
    });
    input.click();
  },
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});