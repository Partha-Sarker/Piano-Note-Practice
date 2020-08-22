$(document).ready(function () {
    var sheet = false;
    var isStopped = true;

    var currentSheetNote = '';
    var correct = 0, wrong = 0;
    var correctCount = $('#correct-count');
    var wrongCount = $('#wrong-count');
    var stopButton = $('#stop-button');
    var jq_greetings = $("#grettings");
    var jq_note = $('#note');
    var jq_noteButton = $('#note-button');
    var jq_sheetButton = $('#sheet-button');
    var jq_sheet = $('#sheet');
    var jq_explosion = $('.explosion');

    stopPlaying();

    drawSheet();

    jq_noteButton.click(function (e) {
        if(isStopped){
            sheet = false;
            startPlaying();
            jq_note.slideDown();
            return;
        }
        if(!sheet)
            return;
        console.log("note");
        
        sheet = false;
        jq_note.slideDown();
        jq_sheet.slideUp();
    });

    jq_sheetButton.click(function (e) { 
        if(isStopped){
            sheet = true;
            startPlaying();
            jq_sheet.slideDown();
            return;
        }
        if(sheet)
            return;
        
        console.log("sheet");
        sheet = true;
        jq_sheet.slideDown();
        jq_note.slideUp();
    });

    stopButton.click(function (e) {
        if(stopButton.text() == 'Start'){
            startPlaying();
        }
        else{
            stopPlaying();
        }
    });

    $('.octave').click(function (e) {
        // if(stopButton.text() != 'Stop')
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
        // console.log(pianoNote);
        

        if(sheet == true){
            if(finalNote == currentSheetNote){
                onCorrectAnswer()
            }
            else{
                onWrongAnswer()
            }
        }
        else{
            if(classList.includes(jq_note.text())){
                onCorrectAnswer()
            }
            else{
                onWrongAnswer();
            }
        }

    });

    function onCorrectAnswer(){
        correct++;
        setTextFadeIn(correctCount, 'Correct: '+correct);

        jq_explosion.toggleClass('animate-correct');
        setTimeout(function(){
            if(jq_explosion.hasClass('animate-correct')){
                jq_explosion.toggleClass('animate-correct');
                console.log('has correct');
            }
            if(jq_explosion.hasClass('animate-wrong')){
                jq_explosion.toggleClass('animate-wrong');
                console.log('has wrong');
            }
        }, 500)
        setRandomNote();
    }
    
    function onWrongAnswer(){
        wrong++;
        setTextFadeIn(wrongCount, 'Wrong: '+wrong);

        jq_explosion.toggleClass('animate-wrong');
        setTimeout(function(){
            if(jq_explosion.hasClass('animate-correct')){
                jq_explosion.toggleClass('animate-correct');
                console.log('has correct');
            }
            if(jq_explosion.hasClass('animate-wrong')){
                jq_explosion.toggleClass('animate-wrong');
                console.log('has wrong');
            }
        }, 500)
        setRandomNote(jq_note.text());
    }

    function startPlaying(){
        isStopped = false;
        stopButton.show();
        jq_greetings.slideUp();  
        setRandomNote();
    }

    function stopPlaying(){
        stopButton.hide();
        jq_sheet.slideUp();
        jq_note.slideUp();
        jq_greetings.slideDown();
        isStopped = true;
        correct = 0, wrong = 0;
        setTextFadeIn(correctCount, 'Correct: 0');
        setTextFadeIn(wrongCount, 'Wrong: 0');
    }

    function setRandomNote(currentNote = ''){
        if(currentNote != ''){
            if(!sheet)
                setTextFadeIn(jq_note, pianoNote);
            else
                jq_note.text(finalNote);
            return;
        }

        var finalNote= '';
        var notes= 'ABCDEFG';
        var extras = '#b ';
        
        var pianoNote = notes.charAt(Math.floor(Math.random() * notes.length));
        var extra = extras.charAt(Math.floor(Math.random() * extras.length));
        
        finalNote = (pianoNote + extra).trim();

        if(!sheet)
            setTextFadeIn(jq_note, finalNote);
        else
            jq_note.text(finalNote);


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