(function() {
  'use strict';

  $.widget("custom.muikkuFileField", {
    options : {
        maxFileSize: undefined,
        confirmRemove: false,
        confirmRemoveHtml: null
      },
    _create : function() {
      this._readonly = false;
      this._fieldName = this.element.attr("name");
      
      this._uploaderContainer = $('<div>')
        .addClass('muikku-file-input-field-file-uploader-container')
        .insertAfter(this.element);
      
      this._uploader = $('<input>').attr({
        'type' : 'file',
        'name' : 'file'
      }).appendTo(this._uploaderContainer).fileupload({
        url : CONTEXTPATH + '/tempFileUploadServlet',
        dropZone: $(this.element),
        autoUpload : true,
        add : $.proxy(this._onFileUploadAdd, this),
        done : $.proxy(this._onFileUploadDone, this),
        always: $.proxy(this._onFileUploadAlways, this),
        progress : $.proxy(this._onFileUploadProgress, this)
      });

      $('<span>')
        .addClass('muikku-file-input-field-description')
        .html(getLocaleText('plugin.workspace.fileField.fieldHint'))
        .appendTo(this._uploaderContainer);

      this._filesContainer = $('<div>')
        .addClass('muikku-file-input-field-file-files-container')
        .appendTo(this._uploaderContainer);
      
      var fileCount = this.element.attr('data-file-count')||0;
      for (var i = 0; i < fileCount; i++) {
        var fileElement = this._createFileElement(i);
        var fileId = this.element.attr('data-file-' + i + '.file-id');
        var fileName = this.element.attr('data-file-' + i + '.filename');
        this._updateFileMeta(i, fileId, fileName, this.element.attr('data-file-' + i + '.content-type'));
        this._updateFileLabel(i, fileName, fileId);
        this._updateFileProgress(i, 100);
      }

      $('<div>')
        .addClass('muikku-file-input-field-download-all')
        .text(getLocaleText('plugin.workspace.fileField.downloadAllLink'))
        .appendTo(this._uploaderContainer)
        .toggle(fileCount > 1)
        .on('click', $.proxy(function() {
          var files = this.files();
          if (files && files.length > 0) {
            window.location = '/rest/workspace/allfileanswers/' + files[0].fileId + '?archiveName=' + getLocaleText('plugin.workspace.fileField.zipFileName');
          }
        }, this));

      this._fileIndex = fileCount;
      
      this.element.closest('form').submit($.proxy(this._onFormSubmit, this));

      this.element.attr("disabled", "disabled").hide();
    },
    
    files: function () {
      return $.map(this._filesContainer.find('.muikku-file-input-field-file'), $.proxy(function (fileElement) {
        var fileIndex = $(fileElement).attr('data-file-index');
        var fieldPrefix = this._fieldName + '.' + fileIndex;
        var fileId = $(fileElement).find('input[name="' + fieldPrefix + '-file-id"]').val();
        return {
          fileId: fileId,
          name: $(fileElement).find('input[name="' + fieldPrefix + '-filename"]').val(),
          contentType: $(fileElement).find('input[name="' + fieldPrefix + '-content-type"]').val()
        };
      }, this));
    },

    hide: function () {
      this._uploaderContainer.hide();
    },
    
    show: function () {
      this._uploaderContainer.show();
    },
    
    reset: function () {
      this._filesContainer.find('.muikku-file-input-field-file').remove();
      this.element.trigger("change");
    },
    
    _findFileElementByIndex: function (index) {
      return this._filesContainer.find('.muikku-file-input-field-file[data-file-index="' + index + '"]');
    },
    
    _createFileElement: function (index) {
      return $('<div>')
        .addClass('muikku-file-input-field-file')
        .attr('data-file-index', index)
        .append($('<div>')
          .addClass('muikku-file-input-field-file-progress')
          .progressbar({
            value: 0
          }).append($('<div>')
              .addClass('muikku-file-input-field-file-progress-literal'))
        )
        .append($('<label>')
          .addClass('muikku-file-input-field-file-label')
        )
        .append($('<a>')
          .attr({
            'href': 'javascript:void(null)'
          })
          .html(getLocaleText('plugin.workspace.fileField.removeLink'))
          .click($.proxy(this._onFileRemoveClick, this))
          .addClass('muikku-file-input-field-file-remove')
        )
        .appendTo(this._filesContainer);
    },
    
    _updateFileMeta: function (fileIndex, fileId, fileName, contentType) {
      var fileElement = this._findFileElementByIndex(fileIndex);
      var fieldPrefix = this._fieldName + '.' + fileIndex;
      
      var fileIdElement = this._filesContainer.find('input[name="' + fieldPrefix + '-file-id"]');
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

      } else {
        fileElement.find('input[name="' + fieldPrefix + '-content-type"]').val(contentType);
        fileElement.find('input[name="' + fieldPrefix + '-filename"]').val(fileName);
        fileElement.find('input[name="' + fieldPrefix + '-file-id"]').val(fileId);
      }
    },
    
    _updateFileProgress: function (index, progress, loaded, total) {
      var postfix = loaded == total ? '' : (loaded && total) ? Math.round((loaded / 1024)) + ' kB / ' + Math.round((total / 1024)) + ' kB' : '';
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-progress').progressbar("value", progress);
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-progress-literal').text(postfix);
    },
    
    _updateFileLabel: function (index, text, fileId) {
      var fileLabel = this._findFileElementByIndex(index).find('.muikku-file-input-field-file-label');
      $(fileLabel).empty();
      $(fileLabel).append($('<a>')
        .attr({
          'href': '/rest/workspace/fileanswer/' + fileId
        }).text(text)
      );
    },
    
    _removeFile: function (file) {
      if (file) {
        $(file).remove();
        this.element.trigger("change");
        this._uploaderContainer.find('.muikku-file-input-field-download-all').toggle(this.files().length > 1);
      }
    },

    _onFileUploadAdd : function(e, data) {
      this.element.closest('form').find('input[type="submit"]').attr('disabled', 'disabled');
      var i, l;
      for (i = 0, l = data.originalFiles.length; i < l; i++) {
        if (data.originalFiles[i].size && data.originalFiles[i].size > this.options.maxFileSize) {
          var maxFileSizeConvertToMB = Math.floor(this.options.maxFileSize / 1048576);
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materialsManagement.fileFieldUpload.fileSizeTooLarge', maxFileSizeConvertToMB));
          return;
        }
        else {
          data.context = this._createFileElement(this._fileIndex);
          this._fileIndex++;
          $(this.element).trigger('uploadStart');
        }
      }
      data.submit();
    },
    
    _onFileRemoveClick: function (event) {
      var file = $(event.target).closest('.muikku-file-input-field-file');
      
      if (this.options.confirmRemove === true) {
        var dialog = $(this.options.confirmRemoveHtml);
        
        dialog.dialog({
          modal: true, 
          dialogClass: this.options.confirmRemoveDialogClass,
          buttons: [{
            'text': dialog.attr('data-button-remove-text'),
            'class': 'delete-button',
            'click': $.proxy(function(event) {
              this._removeFile(file);
              $(dialog).remove();
            }, this)
          }, {
            'text': dialog.attr('data-button-cancel-text'),
            'class': 'cancel-button',
            'click': $.proxy(function(event) {
              $(dialog).remove();
            }, this)
          }]
        });
      } else {
        this._removeFile(file);
      }
    },
    
    _onFileUploadDone : function(e, data) {
      var fileId = data._response.result.fileId;
      var fileName = data.files[0].name;
      var contentType = data.files[0].type;
      if (contentType == '' || contentType == 'application/download' || contentType == 'application/x-download' || contentType == 'bad/type') {
        contentType = data._response.result.fileContentType != null ? data._response.result.fileContentType : contentType;
        if (contentType == '') {
          contentType = 'application/download';
        }
      }
      
      var index = parseInt(data.context.attr('data-file-index'));

      this._updateFileMeta(index, fileId, fileName, contentType);
      this._updateFileLabel(index, fileName, fileId);
      
      $(this.element).trigger('uploadDone', {
        id: fileId,
        name: fileName,
        contentType: contentType
      });
      
      this.element.trigger("change");
      
      this._uploaderContainer.find('.muikku-file-input-field-download-all').toggle(this.files().length > 1);
    },
    
    _onFileUploadAlways: function () {
      this.element.closest('form').find('input[type="submit"]').removeAttr('disabled');
    },

    _onFileUploadProgress : function(e, data) {
      $(this.element).trigger('muikku-field-progress');
      var progress = parseInt(data.loaded / data.total * 100, 10);
      this._updateFileProgress(data.context.attr('data-file-index'), progress, data.loaded, data.total);
    },
    
    _onFormSubmit: function (event) {
      this._uploader.remove();
    },
    
    _destroy : function() {

    },

    isReadonly: function () {
      return this._readonly;
    },

    setReadonly: function (readonly) {
      this._readonly = readonly;
      if (readonly) {
        $(this._uploader).attr("disabled", "disabled");
        $(this._uploader).closest(".muikku-file-input-field-file-uploader-container").attr("data-readonly", "readonly");
        if ($(this._uploaderContainer).find('.muikku-file-input-field-file:visible').length > 0) {
          $(this._uploaderContainer).find('.muikku-file-input-field-description').hide();
          
        } else {
          $(this._uploaderContainer).find('.muikku-file-input-field-description').html(getLocaleText('plugin.workspace.fileField.fieldHintDisabled'));
        }
        $(this._uploaderContainer).find('.muikku-file-input-field-file-remove').hide();
      }
      else {
        $(this._uploader).removeAttr("disabled");
        $(this._uploader).closest(".muikku-file-input-field-file-uploader-container").removeAttr("data-readonly");
        $(this._uploaderContainer).find('.muikku-file-input-field-description').html(getLocaleText('plugin.workspace.fileField.fieldHint'))
        $(this._uploaderContainer).find('.muikku-file-input-field-description').show();
        $(this._uploaderContainer).find('.muikku-file-input-field-file-remove').show();
      }
    }
  });

}).call(this);