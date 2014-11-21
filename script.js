/**
 * Created by Таника on 11.11.14.
 */
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
var key = 'a2b6b644-696f-405b-aaf6-947435344c18';

var dict = new webspeechkit.Dictation("wss://webasr.yandex.net/asrsocket.ws", uuid, key);


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

        var format = webspeechkit.FORMAT['PCM16'];

        $('#content_uttr').html('');
        $('#content_curr').html('');
        console.log('pre init');
        dict.start(format,
            function () {
                console.log('init!')
            },
            function (msg) {
                console.log(msg);
                location.reload();
            },
            function (text, uttr, merge) {
                if (uttr) {
                    $('#content_uttr').append(' ' + text);
                    text = "";
                }
                $('#content_curr').html(text);
                console.log(text);
                if((text + uttr).toLowerCase().search('окей')!= -1)
                {
                    stop();
                }
            },
            function (info) {
//                $('#bytes_send').html(info.send_bytes);
//                $('#packages_send').html(info.send_packages);
//                $('#processed').html(info.processed);
            }
        );
    });

//    $('.stop').click(function () {
//            $('.start').css('display', 'block');
//            $('.stop').css('display', 'none');
//            $('.add_note').css('display', 'none');
//            dict.stop();
//            var $note = $(".add_note");
//            var note_text = $note.text();
//            var note_text1 = $.trim(note_text);
//            console.log(note_text1);
//            if (note_text1 != '')
//            {
//                addNote(note_text);
//                saveNodes();
//                renderNotes();
//            };
//        }
//    );

    function stop() {
            $('.start').css('display', 'block');
            $('.stop').css('display', 'none');
            $('.add_note').css('display', 'none');
            dict.stop();
            var $note = $(".add_note");
            var note_text = $note.text().replace('Окей','');
            var note_text1 = $.trim(note_text);
            console.log(note_text1);
            if (note_text1 != '')
            {
                addNote(note_text.replace('окей',''));
                saveNodes();
                renderNotes();
            }
    };

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
            saveNodes();
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

    function saveNodes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
});



