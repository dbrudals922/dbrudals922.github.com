(function ($) {
  (function (pluginName) {
    var defaults = {
      inputField: 'input.keypad',
      buttonTemplate: '<button></button>',
      checkButtonText: '✔',
      deleteButtonText: '←',
      checkButtonClass: 'check',
      deleteButtonClass: 'delete'
    };
    $.fn[pluginName] = function (options) {
      options = $.extend(true, {}, defaults, options);

      return this.each(function () {
        var elem = this,
          $elem = $(elem),
          $input = jQuery.type(options.inputField) == 'string' ? $(options.inputField) : options.inputField,
          $form = $input.parents('form').length ? $($input.parents('form')[0]) : $elem;

        var numbers = Array.apply(null, Array(9)).map(function (_, i) {
          return $(options.buttonTemplate).html(i + 1).addClass('number');
        });
        numbers.push($(options.buttonTemplate).html("0").addClass('number'));
        numbers.push($(options.buttonTemplate).html(options.checkButtonText).addClass(options.checkButtonClass));
        numbers.splice(5, 0, $(options.buttonTemplate).html(options.deleteButtonText).addClass(options.deleteButtonClass));

        $elem.html(numbers).addClass('keypad');

        $elem.find('.number').click(function (e) {
          $input.val($input.val() + $(e.target).text());
          $input.trigger('change');
        });
        $elem.find('.' + options.deleteButtonClass).click(function (e) {
          $input.val($input.val().slice(0, -1));
          $input.trigger('change');
        });
        $elem.find('.' + options.checkButtonClass).click(function (e) { //check button click
          var userText = $("#numInput").val();
          var setText = document.getElementById("textArea");

          if (!userText) {
            setText.innerHTML += "숫자를 입력해주세요.\n";
            return
          }

          //check if userText is number 입력한 게 숫자인지 확인.
          for (var i = 0; i < userText.length; i++) {
            if (userText.charCodeAt(i) < 48 || userText.charCodeAt(i) > 57
              || userText.length != numLength) {
              setText.innerHTML += "숫자 3개를 입력해주세요.\n";
              check = false;
              break;
            }
          }

          //check strike,ball,out
          var strike, ball;

          // 숫자인지 확인이 됐다면
          if (check) {
            strike = 0;
            ball = 0;

            for (var i = 0; i < getNum.length; i++) {
              for (var k = 0; k < userText.length; k++) {
                if ((getNum[i] == userText[k]) && (i == k)) { // 위치와 숫자가 모두 맞을때
                  strike++;
                } else if ((getNum[i] == userText[k]) && (i != k)) { // 숫자만 맞을때
                  ball++;
                }
              }
            }

            if (strike == 0 && ball == 0) { // 맞는 숫자가 하나도 없을 때
              setText.innerHTML += userText + " : out!\n";
            } else if (strike == numLength) { // 맞췄을 때
              setText.innerHTML += numLength
                + "strike! you won the game!!!\nclick restart to play again\n";
              document.getElementById("victoryImg").style.display = "inline";
            } else {
              setText.innerHTML += userText + " : ";
              setText.innerHTML += (strike + " strike, " + ball + " ball!\n");
            }
          }
          check = true;
        });
      });
    };
    $.fn[pluginName].defaults = defaults;
  })('keypad');
})(jQuery);

// =========================================================

var getNum = new Array();
var numLength = 3;
var check = true;

window.onload = function () {
  setNumber();
}

// 맞출 숫자 지정
function setNumber() {
  var random;
  getNum.splice(0, getNum.length);
  while (getNum.length < numLength) {
    random = Math.floor(Math.random() * 10);

    for (var i = 0; i < getNum.length; i++) {
      if (getNum[i] == random) {
        check = false;
        break;
      }
    }

    if (check && getNum[0] != 0) {
      getNum.push(random);
    }
    check = true;
  }

  // document.getElementById("answer").innerText = getNum;
}

//restart game
function reload() {
  $("#numInput").val("");
  document.getElementById("textArea").innerHTML = "";
  document.getElementById("victoryImg").style.display = "none";
  setNumber();
}