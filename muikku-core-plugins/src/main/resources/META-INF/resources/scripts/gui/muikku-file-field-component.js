(function() {
  'use strict';

  $.widget("custom.muikkuFileField", {
    _create : function() {
      this._fieldName = this.element.attr("name");
      this._multiple = this.element.attr("multiple") == 'multiple';
      this._fileIndex = 0;
      
      this._uploader = $('<input>').attr({
        'type' : 'file',
        'name' : 'file'
      }).insertAfter(this.element).fileupload({
        url : CONTEXTPATH + '/tempFileUploadServlet',
        autoUpload : true,
        add : $.proxy(this._onFileUploadAdd, this),
        done : $.proxy(this._onFileUploadDone, this),
        progress : $.proxy(this._onFileUploadProgress, this)
      });
      
      this._fileCount = $('<input>').attr({
        'type' : 'hidden',
        'name' : this._fieldName + '-file-count',
        'value': '0'
      }).insertAfter(this.element);
      
      var fileCount = this.element.data('file-count')||0;
      for (var i = 0; i < fileCount; i++) {
        var fileElement = this._createFileElement(i);
        var fileId = this.element.data('file-' + i + '.file-id');
        var fileName = this.element.data('file-' + i + '.filename');
        
        this._updateFileMeta(i, fileId, fileName, this.element.data('file-' + i + '.content-type'));
        this._updateFileLabel(i, fileName);
        this._updateFileProgress(i, 100);
        
        $('<input>').attr({
          type : 'hidden',
          name : this._fieldName + '.' + i + '-original-file-id',
          value : fileId
        }).appendTo(fileElement);
      }

      this.element.hide();
    },
    
    _findFileElementByIndex: function (index) {
      return this.element.parent().find('.muikku-file-input-field-file[data-file-index="' + index + '"]');
    },
    
    _createFileElement: function (index) {
      return $('<div>')
        .addClass('muikku-file-input-field-file')
        .attr('data-file-index', index)
        .append($('<div>')
          .addClass('muikku-file-input-field-file-progress')
          .progressbar({
            value: 0
          })
        )
        .append($('<label>')
          .addClass('muikku-file-input-field-file-label')
        )
        .appendTo(this.element.parent());
    },
    
    _updateFileMeta: function (fileIndex, fileId, fileName, contentType) {
      var fileElement = this._findFileElementByIndex(fileIndex);
      var fieldPrefix = this._fieldName + '.' + fileIndex;
      
      var fileIdElement = this.element.parent().find('input[name="' + fieldPrefix + '-file-id"]');
      if (fileIdElement.length == 0) {
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-content-type',
          value : contentType
        }).appendTo(fileElement);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-filename',
          value : fileName
        }).appendTo(fileElement);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-file-id',
          value : fileId
        }).appendTo(fileElement);

        this._fileCount.val(parseInt(this._fileCount.val()) + 1);
      } else {
        fileElement.find('input[name="' + fieldPrefix + '-content-type"]').val(contentType);
        fileElement.find('input[name="' + fieldPrefix + '-filename"]').val(fileName);
        fileElement.find('input[name="' + fieldPrefix + '-file-id"]').val(fileId);
      }
    },
    
    _updateFileProgress: function (index, progress) {
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-progress').progressbar("value", progress);
    },
    
    _updateFileLabel: function (index, text) {
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-label').text(text);
    },

    _onFileUploadAdd : function(e, data) {
      data.context = this._findFileElementByIndex(this._fileIndex);
      
      if (data.context.length == 0) {
        data.context = this._createFileElement(this._fileIndex);
      }
      
      data.submit();
    },

    _onFileUploadDone : function(e, data) {
      var fileId = data._response.result.fileId;
      var fileName = data.files[0].name;
      var contentType = data.files[0].type;
      this._updateFileMeta(this._fileIndex, fileId, fileName, contentType);
      this._updateFileLabel(this._fileIndex, fileName);
      
      if (this._multiple) {
        this._fileIndex++;
      }
    },

    _onFileUploadProgress : function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      this._updateFileProgress(data.context.data('file-index'), progress);
    },
    
    _destroy : function() {

    }
  });

  $(document).ready(function() {
    $(".muikku-file-input-field").muikkuFileField();
  });
}).call(this);