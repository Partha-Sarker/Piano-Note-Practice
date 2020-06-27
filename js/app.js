$(document).ready(function () {
    var correct = 0, wrong = 0;
    var correctCount = $('#correct-count');
    var wrongCount = $('#wrong-count');
    var playButton = $('#play-button');
    var note = $('#note');

    stopPlaying();

    playButton.click(function (e) {
        if(playButton.text() == 'Start'){
            startPlaying();
        }
        else{
            stopPlaying();
        }
    });

    $('.octave').click(function (e) { 
        var values = e.target.className.split(' ');
        if(values.includes('white-key') || values.includes('black-key')){
            // console.log(e.target.className);
            if(playButton.text() != 'Stop')
                return;
            if(values.includes(note.text())){
                correct++;
                setTextFadeIn(correctCount, 'Correct: '+correct);
                setRandomNote();
            }
            else{
                wrong++;
                setTextFadeIn(wrongCount, 'Wrong: '+wrong);
                setRandomNote(note.text());
            }
        }
    });

    function startPlaying(){
        playButton.text('Stop');
        setRandomNote();
    }

    function stopPlaying(){
        playButton.text('Start');
        correct = 0, wrong = 0;
        setTextFadeIn(correctCount, 'Correct: 0');
        setTextFadeIn(wrongCount, 'Wrong: 0');
        setTextFadeIn(note, 'Here Comes The Note! Press START');
    }

    function setRandomNote(currentNote = ''){
        if(currentNote != ''){
            setTextFadeIn(note, currentNote);
            return;
        }
        var finalNote= '';
        var notes= 'ABCDEFG';
        finalNote += notes.charAt(Math.floor(Math.random() * notes.length));
        var extras = '#b ';
        finalNote += extras.charAt(Math.floor(Math.random() * extras.length));
        finalNote = finalNote.trim();
        setTextFadeIn(note, finalNote);
    }

    function setTextFadeIn(element, text){
        element.fadeOut( function() {
            element.text(text).fadeIn();
        });
    }
});