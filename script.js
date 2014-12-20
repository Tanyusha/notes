/**
 * Created by Таника on 11.11.14.
 */
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
var key = 'a2b6b644-696f-405b-aaf6-947435344c18';
//создаем экзеземпляр класса webspeechkit.Dictation, который занимается взаимодействием с сервером
var dictation = new webspeechkit.Dictation("wss://webasr.yandex.net/asrsocket.ws", uuid, key);


var retrievedObject = localStorage.getItem('notes');
var notes = JSON.parse(retrievedObject);
if (!notes) {
    notes = [];
}


$(document).ready(function () {
    renderNotes();
    $('.start').click(function () {
        $('.start').css('display', 'none');
//        $('.stop').css('display', 'block');
        $('.add_note').css('display', 'block');

        //задаем формат для передаваемых данных
        var format = webspeechkit.FORMAT['PCM16'];

        //выполняется после успешной инициализации
        var on_init_f = function () {
            console.log('init!')
        };
        //вызовется в случае ошибок в коде библиотеки или ошибок на сервере
        var on_error_f= function (msg) {
            console.log(msg);
            location.reload(); //перезагрузка страницы
        };
        //функция, вызываемя после получения распознанного текста. производит запись распознанного по частям текста в соответсвующее поле
        var on_msg_f = function (text, uttr, merge) {
            if (uttr) { //если текст уже был распознан
                $('#content_uttr').append(' ' + text); //добавляем новый распознанный текст к уже имеющемуся
                text = "";//очищаем переменную для нового распознанного текста
            }
            $('#content_curr').html(text);//записываем новый распознанный текст
            console.log(text);
            if((text + uttr).toLowerCase().search('окей')!= -1)//поиск команды в распознанном тексте
            {
                stop(); //если команда была найдена, вызываем функцию окончания распознавания
            }
        };
        //функция предоставляет инорфмационные данные о текущем сеансе (количество отправленных байт, количество посланных пакетов, количество распознаных данных)
        var on_info_f = function (info) {
//                $('#bytes_send').html(info.send_bytes);
//                $('#packages_send').html(info.send_packages);
//                $('#processed').html(info.processed);
        };

        $('#content_uttr').html('');//очистка полей для вывода распознанного текста
        $('#content_curr').html('');//очистка полей для вывода распознанного текста
        console.log('pre init');
        //начинаем работу с сервером Яндекса, для этого вызываем метод start экземпляра класса dictation и в качестве параметров передаем ему ранее описанные функции
        dictation.start(
            format,
            on_init_f,
            on_error_f,
            on_msg_f,
            on_info_f
        );
    });

//    $('.stop').click(function () {
//            $('.start').css('display', 'block');
//            $('.stop').css('display', 'none');
//            $('.add_note').css('display', 'none');
//            dictation.stop();
//            var $note = $(".add_note");
//            var note_text = $note.text();
//            var note_text1 = $.trim(note_text);
//            console.log(note_text1);
//            if (note_text1 != '')
//            {
//                addNote(note_text);
//                saveNotes();
//                renderNotes();
//            };
//        }
//    );

    //отвечает за прерывание потока посылаемых на сервер Яндекса байт на распознавание.
    function stop() {
            $('.start').css('display', 'block');
            $('.stop').css('display', 'none');
            $('.add_note').css('display', 'none');
            dictation.stop();
            var $note = $(".add_note");
            var note_text = $note.text().replace('Окей','');
            var note_text1 = $.trim(note_text);
            console.log(note_text1);
            if (note_text1 != '')
            {
                addNote(note_text.replace('окей',''));
                saveNotes();
                renderNotes();
            }
    }

    function renderNotes() {
        $('.notes').empty();

        var date_num=0;
        var previous_date;
        var css_class;
        for (var i = 0; i < notes.length; i++) {
            console.log(i);

            if (notes[i].date === previous_date) {
                $(css_class).prepend('<p class="new_note_' + i + ' new_note">' + notes[i].note + ' ' +
                    '<span class="glyphicon glyphicon-ok done" data-title="Сделано!"></span></p>');
            }
            else {
                previous_date = notes[i].date;
                date_num++;
                $('.notes').prepend('<h2>' + notes[i].date + '</h2><hr class="before_notes_in_date"/> ' +
                    '<div class ="date_' + date_num + '"></div><hr class="after_notes_in_date"/>');
                var css_class = ".date_" + date_num;
                $(css_class).prepend('<p class="new_note_' + i + ' new_note">' + notes[i].note + ' ' +
                    '<span class="glyphicon glyphicon-ok done" data-title="Сделано!"></span></p>');
            }
        }
        $('.done').click(function () {
            var name = $(this).closest('p').attr("class").split(' ')[0];
            console.log(name);
            index = name.match(/\d+/);
            console.log(index[0]);
            $(this).closest('p').remove();
            notes.splice(index, 1);
            saveNotes();
        });
    }

    function addNote(note_text) {
        var m_names = ["января", "февраля", "марта", "апреля",
            "мая", "июня", "июля", "августа", "сентября",
            "остября", "ноября", "декабря"];
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        var date = curr_date + " " + m_names[curr_month] + " " + curr_year;
        var note = {
            'date': date,
            'note': note_text
        };

        notes.push(note);

    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
});



