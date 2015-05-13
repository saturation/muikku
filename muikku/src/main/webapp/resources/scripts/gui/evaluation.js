(function() {
    
  $.widget("custom.evaluationSlyder", {
    options : {
      workspaceEntityId: null
    },
    
    _create : function() {
      this.element.append($('<div>').addClass('evaluation-views-slyder'));
      
      this._pagesLoaded = {};
      
      this._loadPage(0, $.proxy(function () {
        this._loadPage(1, $.proxy(function () {
          this.element.sly({
            horizontal: 1,
            itemNav: 'forceCentered',
            smart: false,
            activateMiddle: 1,
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            scrollBy: 0,
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            scrollBar: '.scrollbar',
            prevPage: '.prevPage',
            nextPage: '.nextPage',
            dragHandle: 1,
            dynamicHandle: 1,
            minHandleSize: 50,
            clickBar: 1,
            syncSpeed: 0.5
          })
          .sly('on', 'active', $.proxy(this._onSlyActive, this));
        }, this));
      }, this));
    },
    
    _loadPage: function (pageId, callback) {
      console.log("look! im loading a page!");
      
      if (pageId === 0) {
        $('#contentEvaluation').append($('<div>').addClass('content-loading').append($('<div>').addClass('icon-spinner')));
      }

      this._pagesLoaded[pageId] = 'LOADING';
      
      $.ajax({
        url : CONTEXTPATH + '/evaluation/' + this.options.workspaceEntityId + '/page/' + pageId + '?maxStudents=' + this.options.maxStudents,
        success : $.proxy(function(data) {
          var soom = $(data).find('.evaluation-student-wrapper').length; // Sivulla Olevien Opiskelijoiden Määrä
          
          if(soom > 0) {
            this._pagesLoaded[pageId] = 'LOADED';
          
            this.element.find('.evaluation-views-slyder').append($(data).css('width', this.element.width()));
            //this.element.sly('reload');
            
            var marginLeft = (($(".evaluation-view-wrapper").width()-(180*this.options.maxStudents))/2)-10;
            this.element.find('.evaluation-student-listing-wrapper').css('margin-left', marginLeft);
            this.element.find('.evaluation-student-assignment-listing-wrapper').css('margin-left', marginLeft);
            this.element.find('.evaluation-student-assignment-listing-wrapper').css('max-height', window.innerHeight-260);
            this.element.sly('reload');
              
            if ($.isFunction(callback)) {
              callback();
            }
        /*
        } ,this),
        complete : $.proxy(function(data) {
                 */
          
            if(pageId > 0) {
              if(soom === this.options.maxStudents) {
                this._loadPage(pageId+1);
              } else {
                $('.content-loading').animate({
                  opacity: 0
                },{
                  duration:900,
                  easing: "easeInOutQuint",
                  complete: function () {
                    $('.content-loading').remove();
                  }
                });
              }
            }
            
            this.element.sly('reload');
          } else {
            $('.content-loading').animate({
              opacity: 0
            },{
              duration:900,
              easing: "easeInOutQuint",
              complete: function () {
                $('.content-loading').remove();
              }
            });
          }
        } ,this)
        
            /*
        complete : $.proxy(function(data) {
            $('.content-loading')
              .animate({
                opacity: 0
            },{
              duration:900,
              easing: "easeInOutQuint",
              complete: function () {
                $('.content-loading').remove();
              }
            });
          }
          
        } ,this)
        */
      });
      
      if(this.options.maxStudents < 3) {
        $('.evaluation-slyder-controls').hide();
      } else {
        $('.evaluation-slyder-controls').show();
      }
    },
    
    _onSlyActive: function (eventName, index) {
        /*
      if (!this._pagesLoaded[index + 1]) {
        this._loadPage(index + 1);
      } else {
        console.log("look! im NOT loading a page!");
      }
        */
    },
   
    _destroy: function () {
      
    }
  });
  
  function openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, workspaceMaterialEvaluation) {
    renderDustTemplate('evaluation/evaluation_evaluate_modal_view.dust', {
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val())
    }, $.proxy(function (text) {
      var dialog = $(text);
      
      dialog.dialog({
        modal: true, 
        height: $(window).height() - 50,
        resizable: false,
        width: $(window).width() - 50,
        dialogClass: "evaluation-evaluate-modal",
        open: function() {
          // TODO: Assessor select
          
          $(this).find('input[name="evaluated"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          if (!workspaceMaterialEvaluation) {
            $(this).find('input[name="evaluated"]')
              .datepicker('setDate', new Date());
          } else {
            var gradeId = 
              workspaceMaterialEvaluation.gradeIdentifier + '/' + workspaceMaterialEvaluation.gradeSchoolDataSource + '@' + 
              workspaceMaterialEvaluation.gradingScaleIdentifier + '/' + workspaceMaterialEvaluation.gradingScaleSchoolDataSource;
                
            $(this).find('input[name="evaluated"]')
              .datepicker('setDate', new Date(workspaceMaterialEvaluation.evaluated));
            $(this).find('#evaluateFormLiteralEvaluation').val(workspaceMaterialEvaluation.verbalAssessment);
            $(this).find('select[name="grade"]').val(gradeId);
          }
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeValue = $(this).find('select[name="grade"]')
              .val()
              .split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            // TODO: Switch to ISO 8601
            var evaluated = $(this).find('input[name="evaluated"]').datepicker('getDate').getTime();
            
            mApi().workspace.workspaces.materials.evaluations.create(workspaceEntityId, workspaceMaterialId, {
              evaluated: evaluated,
              gradeIdentifier: grade[0],
              gradeSchoolDataSource: grade[1],
              gradingScaleIdentifier: gradingScale[0],
              gradingScaleSchoolDataSource: gradingScale[1],
              assessorEntityId: MUIKKU_LOGGED_USER_ID,
              studentEntityId: studentEntityId,
              workspaceMaterialId: workspaceMaterialId,
              verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
            }).callback($.proxy(function (err, result) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else { 
                $(this).dialog("destroy").remove();
              }
            }, this));
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-evaluation-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }

  $(document).ready(function() {
    
    $('#evaluation-views-wrapper')
      .evaluationSlyder({
        workspaceEntityId: $('#evaluation-views-wrapper').attr('data-workspace-entity-id'),
        maxStudents: Math.floor($("#evaluation-views-wrapper").width() / 180)
      });
    
    if ($('#evaluationModalWrapper').length > 0) {
      $('#evaluationModalWrapper').hide();
    }

    // Evaluation's workspaces
    if ($('#evaluationQueueWrapper').length > 0) {
      
      var height = $(window).height();
      var queueWrapper = $('#evaluationQueueContainer');
      var queueOpenCloseButton = $('.wi-evaluation-queue-navi-button-toc > .icon-navicon');
      var assigmentContainer = $('#evaluationStudentAssignmentListingWrapper');

      var queueWrapperWidth = queueWrapper.width();
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var contentMinLeftOffset = queueWrapperWidth + 20;
      var assigmentContainerRightPadding = 20;
        
      // Prevent icon-navicon link from working normally
      $(queueOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });

    };
    
    //Prevent page scroll happening if TOC scroll reaches bottom
    $('.evaluation-queue-content-inner, .evaluation-modal-evaluateForm-header, .evaluation-modal-evaluateForm-content')
    .on('DOMMouseScroll mousewheel', function(ev) {
      var $this = $(this),
        scrollTop = this.scrollTop,
        scrollHeight = this.scrollHeight,
        height = $this.height(),
        delta = (ev.type === 'DOMMouseScroll' ?
          ev.originalEvent.detail * -40 :
          ev.originalEvent.wheelDelta),
        up = delta > 0;

      var prevent = function() {
        ev.stopPropagation();
        ev.preventDefault();
        ev.returnValue = false;
        return false;
      };

      if (!up && -delta > scrollHeight - height - scrollTop) {
        // Scrolling down, but this will take us past the bottom.
        $this.scrollTop(scrollHeight);

        return prevent();
      } else if (up && delta > scrollTop) {
        // Scrolling up, but this will take us past the top.
        $this.scrollTop(0);
        return prevent();
      }
    });
    
    /* Evaluate assignment when its state is DONE or CRITICAL (means its late) */
    $(document).on('click', '.assignment-done, .assignment-evaluation-critical', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, null);
    });
    
    /* View evaluation when assigment's state is EVALUATED */
    $(document).on('click', '.assignment-evaluated', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var workspaceMaterialEvaluationId = $(this).attr('data-workspace-material-evaluation-id');
      
      mApi().workspace.workspaces.materials.evaluations.read(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluationId)
        .callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else { 
            openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, result);
          }
        });
      
      /**
      renderDustTemplate('evaluation/evaluation_evaluate_modal_view.dust', { }, $.proxy(function (text) {
        var dialog = $(text);
        $(text).dialog({
          modal: true, 
          height: $(window).height() - 50,
          resizable: false,
          width: $(window).width() - 50,
          dialogClass: "evaluation-evaluate-modal",
          buttons: [{
            'text': dialog.data('button-save-text'),
            'class': 'save-evaluation-button',
            'click': function(event) {
      
            }
          }, {
            'text': dialog.data('button-cancel-text'),
            'class': 'cancel-evaluation-button',
            'click': function(event) {
              $(this).dialog("destroy").remove();
            }
          }]
        });
      }, this));
      **/
    });
    
    //Student user picture tooltip show on mouseover
    $(document).on('mouseover', '.evaluation-workspacelist-item', function (event) {
      
      sName = $(this).attr('data-workspace-title');
      sContainerLoc = $(this).offset().top - $('.evaluation-workspacelist-wrapper').offset().top;
      
      $('#workspaceTitleContainer').css({
        position: 'absolute',
        left: '30px',
        top: sContainerLoc
      })
      .show()
      .clearQueue()
      .stop()
      .animate({
          opacity: 1
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {

          }
        })
      .text(sName);

    });
    
    //Student user picture tooltip hide on mouseout
    $(document).on('mouseout', '.evaluation-workspacelist-item', function (event) {
      
      $('#workspaceTitleContainer')
      .clearQueue()
      .stop()
      .animate({
          opacity: 0
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {
            $(this).hide();
          }
        });

    });
    
    // on browser resize, start over
    $(window).bind('resize', function() {
      window.resizeEvt;
      $(window).resize(function() {
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function() {
          aloitaUpdate();
        }, 500);
      });
    });
    
    $(window).trigger('resize');
    
    function aloitaUpdate() {
      $('.evaluation-views-slyder').html('');
      $('#contentEvaluation').append($('<div>').addClass('content-loading').append($('<div>').addClass('icon-spinner')));
      update(0);
      
      $('#evaluation-views-wrapper').sly('reload');
    }
    
    function update(diaId) {
      var kurssiId = $("#evaluation-views-wrapper").data("workspace-entity-id");
      var UMS = Math.floor($("#evaluation-views-wrapper").width() / 180); // Uusi Max Students
      var DOOM = 0; // Diassa Olevien Opiskelijoiden Määrä
      $.ajax({
        url: 'https://dev.muikku.fi:8443/evaluation/'+ kurssiId +'/page/' + diaId + '?maxStudents=' + UMS,
        success: $.proxy(function(data){
          DOOM = $(data).find('.evaluation-student-wrapper').length;
          if(DOOM > 0) {
            $('.evaluation-views-slyder').append($(data).css('width', $("#evaluation-views-wrapper").width()));

            var marginLeft = (($(".evaluation-view-wrapper").width() - (180 * UMS)) / 2) - 10;
            $('.evaluation-student-listing-wrapper').css('margin-left', marginLeft);
            $('.evaluation-student-assignment-listing-wrapper').css('margin-left', marginLeft);
            $('.evaluation-student-assignment-listing-wrapper').css('max-height', window.innerHeight-260);
            $("#evaluation-views-wrapper").sly("reload");
            
            if(DOOM === UMS) {
              update(diaId + 1);
            } else {
              $('.content-loading').animate({
                opacity: 0
              },{
                duration:900,
                easing: "easeInOutQuint",
                complete: function () {
                  $('.content-loading').remove();
                }
              });
            }
            
            $("#evaluation-views-wrapper").sly("reload");
          } else {
            $('.content-loading').animate({
              opacity: 0
            },{
              duration:900,
              easing: "easeInOutQuint",
              complete: function () {
                $('.content-loading').remove();
              }
            });
          }
        })
      });
      
      if(UMS < 3) {
        $(".evaluation-slyder-controls").hide();
      } else {
        $(".evaluation-slyder-controls").show();
      }
    }

});
  
  
}).call(this);