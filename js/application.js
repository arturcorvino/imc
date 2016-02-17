/**
    Application custom Javascript
**/
var Application = function () {

    /*
    * mascaras dos campos
    **/
    var inputMask = function () {
        $(".mask-weight").maskMoney({thousands:'.', decimal:',', allowZero:true, suffix: ' kg'});
        $(".mask-height").maskMoney({thousands:'.', decimal:',', allowZero:true, suffix: ' m'});
        $(".mask-oldyear").maskMoney({precision:0, allowZero:true, suffix: ' anos'});
    };

    /*
    * Código que faz o formulário passo-a-passo
    **/
    var progressForm = function () {

        var questions,
            imcForm = $('#imc-form'),
            isValid,
            question = $('ol.questions > li'),
            questionsCount,
            current = 1,
            validator = $("#imc-form").validate({
                rules:{
                    'imc-weight': { 
                        checkMaskWheight: true 
                    },
                    'imc-height':{
                        checkMaskWHeight: true 
                    },
                    'imc-oldyea':{
                        checkMaskWOldyear: true 
                    }
                },
                messages:{
                    'imc-weight':{
                        required: "O campo peso é obrigatório.",
                    },
                    'imc-height':{
                        required: "O campo altura é obrigatório.",
                    },
                    'imc-oldyea':{
                        required: "O campo idade é obrigatório.",
                    }
                },
                errorPlacement: function (error, element) {
                    $('.form-error').html(error);
                }
            });

        // Custom validate jquery
        jQuery.validator.addMethod("checkMaskWheight", function(value, element) {
            if (value == '0,00 kg') {
                return false
            } else {
                return true;
            }
        }, "O campo peso deve ser maior do que 0");

        jQuery.validator.addMethod("checkMaskWHeight", function(value, element) {
            if (value == '0,00 m') {
                return false
            } else {
                return true;
            }
        }, "O campo altura deve ser maior do que 0");

        jQuery.validator.addMethod("checkMaskWOldyear", function(value, element) {
            if (value == '0 anos' || value == '00 anos') {
                return false
            } else {
                return true;
            }
        }, "O campo idade deve ser maior do que 0");

        questions = $('ol.questions').find('li');
        questionsCount = questions.length;

        function updateUI(to) {
            if (to <= questionsCount) {
                $('.current-question').html(to + ' / ' + questionsCount);
            }
            var lineWidth = ((to - 1) * 100) / questionsCount;
            $('.line').css('width', lineWidth + '%');
        }

        function focusThis(position) {
            if (current != questionsCount) {
                question.removeClass('current');
                $('ol.questions > li:nth-child(' + position + ')').addClass('current');
            }
            updateUI(position); 
            $('.current').one("transitionend.my MSTransitionEnd.my webkitTransitionEnd.my oTransitionEnd.my",function() {
                $(this).off('.my');
                $('.current input').focus();
            });
        }

        function nextQuestion() {
            focusThis(current + 1);
            if (current == questionsCount) {
                imcForm.submit();
            } else {
                // Se não for a última questão, incrementa um no contador
                current++;
            }
        }

        function prevQuestion() {
            if (current > 1) {
                current--
            };
            focusThis(current);
        }

        function checkEntry() {
            isValid = validator.element(".current input");
            if (isValid) {
                nextQuestion();
            }
        }

        updateUI(0);

        function calcImc(peso, altura) {
            return peso / (altura * 2);
        }

        function getClass(idade, imc) {
            if (idade <= 20) {
                if (imc < 18.5) {
                    imcClass = 'Baixo peso';
                } else if (imc >= 18.5 && imc < 24.9) {
                    imcClass = 'Peso ideal';
                } else if (imc >= 25 && imc < 29.9) {
                    imcClass = 'Excesso de peso';
                } else if (imc >= 30) {
                    imcClass = 'Obesidade';
                }
            } else if (idade > 20 && idade <= 65) {
                if (imc < 18.5) {
                    imcClass = 'Baixo peso';
                } else if (imc >= 18.5 && imc < 24.9) {
                    imcClass = 'Peso ideal';
                } else if (imc >= 25 && imc < 29.9) {
                    imcClass = 'Pré Obesidade';
                } else if (imc >= 30 && imc < 34.9) {
                    imcClass = 'Obesidade grau I';
                } else if (imc >= 35 && imc < 39.9) {
                    imcClass = 'Obesidade grau II';
                } else if (imc >= 40) {
                    imcClass = 'Obesidade mórbida';
                }
            } else if (idade > 65) {
                if (imc < 22) {
                    imcClass = 'Desnutrição';
                } else if (imc >= 22 && imc < 23.9) {
                    imcClass = 'Risco de desnutrição';
                } else if (imc >= 24 && imc < 26.9) {
                    imcClass = 'Peso ideal';
                } else if (imc >= 27 && imc <= 32) {
                    imcClass = 'Pré obesidade';
                } else if (imc > 32) {
                    imcClass = 'Obesidade';
                }
            }

            return imcClass;
        }

        function showMessage(imc, imcClass) {
            $('#title-1').html('Seu IMC é');
            imc = imc.replace('.', ',');
            $('#title-2').html(imc);

            if (imcClass == 'Peso ideal') {
                $('.result-imc-text').html("Parabéns! Você está no seu PESO IDEAL :)");
            } else {
                $('.result-imc-text').html(imcClass+". Ops, está na hora de rever os seus hábitos :/");
            }

            $('#return-message').fadeIn();
            $('#form-questions').fadeOut();
            $('.avatar-2').fadeIn();
        }

        $('#imc-form').submit(function (e) {
            e.preventDefault();

            peso = $('#imc-weight').val().replace(' kg', '').replace(',', '.');
            altura = $('#imc-height').val().replace(' m', '').replace(',', '.');
            idade = $('#imc-oldyea').val().replace(' anos', '');

            peso = parseFloat(peso);
            altura = parseFloat(altura);
            idade = parseFloat(idade);

            imc = calcImc(peso, altura).toFixed(1);
            imcClass = getClass(idade, imc);

            showMessage(imc, imcClass);
        });

        $('.btn-table').click(function(event) {
            $('.tables-content').fadeIn();
        });
        
        $('ol.questions > li:nth-child(' + current + ')').addClass('current');

        imcForm.on('click', function () {
            $('ol.questions > li:nth-child(' + current + ')').addClass('current');
            $('.current input').focus();
            updateUI(current);
        });

        $('ol.questions > li input').on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            // enter
            if (keyCode === 13) {
                e.preventDefault();
                checkEntry();
            }
        });

        $('#next').click(function () {
            checkEntry();
        });
    }

    return {
        //main function to initiate the theme
        init: function() {
            inputMask();
            progressForm();
        }
    };

}();
