"use strict";

tinymce.init({
  selector: 'textarea#desc, textarea#content',
  plugins: 'image code',
  toolbar: 'undo redo | link image | code',
  image_title: true,
  automatic_uploads: true,
  file_picker_types: 'image',
  file_picker_callback: function file_picker_callback(cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var id = 'blobid' + new Date().getTime();
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
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