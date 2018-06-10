window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var options = {
    aspectRatio: NaN,
    viewMode: 3,
    preview: '.img-preview',
    ready: function (e) {
      //console.log(e.type);
    },
    cropstart: function (e) {
      //console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      //console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      //console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      var data = e.detail;

      //console.log(e.type);
      dataX.value = Math.round(data.x);
      dataY.value = Math.round(data.y);
      dataHeight.value = Math.round(data.height);
      dataWidth.value = Math.round(data.width);
    },
    zoom: function (e) {
      //console.log(e.type, e.detail.ratio);
    }
  };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageType = 'image/jpeg';
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
  }

  // Metodos
  actions.querySelector('.botoes-funcoes').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
      //alert(target);
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        //alert(target.hasAttribute('data-option') + '   ' + data.target + '   ' + input);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
            //alert(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }


      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.download = uploadedImageName;
              download.href = result.toDataURL(uploadedImageType);
            }
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

/* TESTES MONSTROS */
  let $test = 1;

  let valores;

  $('#salvar').on('click', function(event) {

      var e = event || window.event;
      var target = e.target || e.srcElement;
      var cropped;
      var result;
      var input;
      var data;

      if (!cropper) {
        return;
      }
      else {
        let posicao = JSON.stringify(cropper.getData());

        //let botaoMonstro = $("<button type='button' id='vsf' class='btn btn-success' data-method='setData' data-target='#salvar'value='(" + posicao + ")'>" + $('#variavel').val() + "</button>");

        let botaoMonstro = $("<div class='btn-group'><button type='button' class='btn btn-primary' data-method='getCroppedCanvas' data-target='#salvar' data-option='blablabla' value='(" + posicao + "'><span class='docs-tooltip' data-toggle='tooltip' title='teste tooltip'>" + $('#variavel').val() + "</span></button><button type='button' class='btn btn-danger' id='excluirCrop' title='Excluir'><span><span class='fa fa-remove'></span></span></button></div>");

        botaoMonstro.appendTo($("#testB"));
        //botaoMonstro.appendTo($(".docs-vsf2"));

        $test++;
        //console.log($test++);
        //console.log($test+1);
      }
  });

  $('#excluirCrop').on('click', function() {
    alert('To aqui porra');
  });


  $('#vsf').on('click', function() {

    console.log('ENTREI AQUI PORRA');
    var blaaa = $('#vsf').val();

    console.log('aaa: ' + blaaa);
    

    if (!cropper) {
      return;
    }

  });

/* TESTES MONSTROS */


  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (!cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };

  // Import image
  var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);
          cropper.destroy();
          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }
};
