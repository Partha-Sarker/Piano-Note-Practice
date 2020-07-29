$(document).ready(function () {
    var sheet = false;
    var currentSheetNote = '';
    var correct = 0, wrong = 0;
    var correctCount = $('#correct-count');
    var wrongCount = $('#wrong-count');
    var playButton = $('#play-button');
    var note = $('#note');
    var jq_noteButton = $('#note-button');
    var jq_sheetButton = $('#sheet-button');
    var jq_sheet = $('#sheet');

    if(sheet)
        jq_sheet.slideDown();
    else
        note.slideDown();

    stopPlaying();

    jq_noteButton.click(function (e) { 
        if(!sheet)
            return;
        
        sheet = false;
        jq_sheet.slideUp();
        note.slideDown();
    });

    jq_sheetButton.click(function (e) { 
        if(sheet)
            return;
        
        sheet = true;
        note.slideUp();
        jq_sheet.slideDown();
    });

    playButton.click(function (e) {
        if(playButton.text() == 'Start'){
            startPlaying();
        }
        else{
            stopPlaying();
        }
    });

    $('.octave').click(function (e) {
        // if(playButton.text() != 'Stop')
        //     return;
        var jq_target = $(e.target);
        var classList = [];
        try {
            classList = jq_target.attr('class').split(' ');            
        } catch (error) {
            jq_target = jq_target.parent();
            classList = jq_target.attr('class').split(' ');            
        }
        if(classList[0] == 'octave')
            return;
        
        
        var pianoNote = classList[1];
        var octave = jq_target.parent().attr('class').split(' ')[1];
        var finalNote = pianoNote + '/' + octave;
        console.log(pianoNote);
        

        if(sheet == true){
            if(finalNote == currentSheetNote){
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
        else{
            if(classList.includes(note.text())){
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
            if(!sheet)
                setTextFadeIn(note, pianoNote);
            else
                note.text(finalNote);
            return;
        }
        var finalNote= '';
        var notes= 'ABCDEFG';
        var extras = '#b ';
        
        var pianoNote = notes.charAt(Math.floor(Math.random() * notes.length));
        var extra = extras.charAt(Math.floor(Math.random() * extras.length));
        
        finalNote = (pianoNote + extra).trim();

        if(!sheet)
            setTextFadeIn(note, pianoNote);
        else
            note.text(finalNote);


        var clefs = ['bass', 'treble'];
        var octave = '';
        var clef = clefs[Math.floor(Math.random() * clefs.length)];

        if(clef == 'bass'){
            octave = '234'.charAt(Math.floor(Math.random() * 3));
            if(octave == '4' && pianoNote != 'C')
                octave = '2';
        }
        else if(clef == 'treble'){
            octave = '44556'.charAt(Math.floor(Math.random() * 3));
        }

        finalNote = pianoNote + '/' + octave;
        currentSheetNote = finalNote;
        drawNote(finalNote, clef, ' ');
    }

    function setTextFadeIn(element, text){
        // element.text(text);
        element.fadeOut( function() {
            element.text(text).fadeIn();
        });
    }

    drawSheet();

    // drawNote('b/6', 'treble', ' ');
    // drawNote('c/4', 'bass', ' ');

    
    function drawSheet(){
        const VF = Vex.Flow;
        $('#sheet svg').remove();


        var div = document.getElementById("sheet");
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        var context = renderer.getContext();
        var stave = new VF.Stave(0, 15, 400);

        stave.addClef('treble');
        
        stave.setContext(context).draw(); 
    }

    function drawNote(note, clef, accidental){
        // console.log(note + ' ' + clef + ' ' + accidental);

        const VF = Vex.Flow;
        $('#sheet svg').remove();


        var div = document.getElementById("sheet");
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        var context = renderer.getContext();
        var stave = new VF.Stave(0, 15, 400);

        stave.addClef(clef);
        
        stave.setContext(context).draw();

        if(accidental != ' ')
            note = new VF.StaveNote({clef: clef, keys: [note], duration: "1" }).addAccidental(0, new VF.Accidental(accidental));
        else
            note = new VF.StaveNote({clef: clef, keys: [note], duration: "1" });

        var notes = [note];
        
        
        var voice = new VF.Voice();
        voice.addTickables(notes);
        
        // Format and justify the notes to 400 pixels.
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
        
        // Render voice
        voice.draw(context, stave);
    }

});