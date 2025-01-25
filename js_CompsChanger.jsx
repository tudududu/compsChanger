//  js_compsChanger
//  copyright Jan Svatuska 2024
//  240506
//  v01a    Dimension section reposition 3D layer, but not 2D
//          nefunguje y pokud x = 0, nebo neni zadano
//  v01b    Condition for dimension: if (inputX.length > 0)
//          Dimension rozchozeno, lze zadat jen y stranu,
//          merime delku retezce, (null a undefined nefungovalo)

(function (thisObj) {
    
    newPanel(thisObj);

    function newPanel(thisObj) {

        var vers = '01';
        var title = 'slate0vator (v' + vers + ')';

        var win = (thisObj instanceof Panel) 
        ? 
        thisObj
        :
        new Window('palette', 'compChanger', undefined);
        
        win.orientation = 'column';
        win.alignChildren = 'fill';
        win.preferredSize = [200, 300];
        var buttonSize = [30, 23];

     //  ================panel01================oo
        var panel01 = win.add('panel', undefined, 'Prejmenovator');
            panel01.orientation = 'column';
            panel01.alignChildren = 'fill';

        //  input text1: Search
        var panel01group01 = panel01.add('group');
            panel01group01.orientation = 'column';
            panel01group01.alignChildren = 'fill';

        var label = panel01group01.add('statictext', undefined, 'Search for:');
        var txtInputSearch = panel01group01.add('edittext', undefined, '');
            txtInputSearch.characters = 25;

        //  input text2: Replace
        var panel01group02 = panel01.add('group');
            panel01group02.orientation = 'column';
            panel01group02.alignChildren = 'fill';

        var label = panel01group02.add('statictext', undefined, 'Replace with:');
        var txtInputReplace = panel01group02.add('edittext', undefined, '');
            txtInputReplace.characters = 25;
        
        //  apply Button
        var applyBtn = panel01group02.add('button', undefined, 'Apply');
        
      // --- Action ---
            applyBtn.onClick = function () {
            prejmenovator(txtInputSearch.text, txtInputReplace.text);
            }
    //  ================panel02a================oo

        var panel02a = win.add('panel', undefined, 'Zkracovator');
            panel02a.orientation = 'row';
            panel02a.alignChildren = 'right';
        //  label
        var label = panel02a.add('statictext', undefined, 'start: ');
        //  input text    
        var startTimeInput = panel02a.add('edittext', undefined, '1', {enterKeySignalsOnChange: false});
            startTimeInput.characters = 10;
        //  apply Button
        var applyBtn = panel02a.add('button', undefined, 'Apply');
        
        // --- Action ---
        function trigerChange() {
            zkracovator(startTimeInput.text);
        }

        startTimeInput.onChange = trigerChange;
        applyBtn.onClick = trigerChange;


    //  ================panel03================oo
    //  comp dur, width, height, fps
    //  
        //  --------panel02--------fields--------
        var panel02 = win.add('panel', undefined, 'comp settings');
            panel02.orientation = 'row';
            panel02.alignChildren = 'right';
        var panel02_groupA = panel02.add('group', undefined, 'labely a pole');
            panel02_groupA.orientation = 'column';
            panel02_groupA.alignChildren = 'right';
        var panel02_groupB = panel02.add('group', undefined, 'tlacitka');
            panel02_groupB.orientation = 'row';
        var panel02_group_1 = panel02_groupA.add('group', undefined, 'panel02_group_1');
            panel02_group_1.orientation = 'row';
        var panel02_group_2 = panel02_groupA.add('group', undefined, 'panel02_group_2');
            panel02_group_2.orientation = 'row';
        var panel02_group_3 = panel02_groupA.add('group', undefined, 'panel02_group_3');
            panel02_group_3.orientation = 'row';
        var panel02_group_4 = panel02_groupB.add('group', undefined, 'panel02_group_4');
            panel02_group_4.orientation = 'column';
        
        //  label
        var labelOne = panel02_group_1.add('statictext', undefined, 'Dimension: ');
        var labelTwo = panel02_group_2.add('statictext', undefined, 'Framerate: ');
        var labelThree = panel02_group_3.add('statictext', undefined, 'Duration: ');
        //  input text
        //var inDimensionX = panel02_group_1.add('edittext', undefined, 'TV');
        var panel02_group_1a = panel02_group_1.add('group', undefined, 'pole dimension');
            panel02_group_1a.orientation = 'column';
        var inDimensionX = panel02_group_1a.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDimensionX.characters = 10;
        var inDimensionY = panel02_group_1a.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDimensionY.characters = 10;
        
        var inFps = panel02_group_2.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inFps.characters = 10;
        
        var inDuration = panel02_group_3.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDuration.characters = 10;
        
        //  apply Button
        var btn01 = panel02_group_4.add('button', undefined, 'OK');
            btn01.size = buttonSize;
        var btn02 = panel02_group_4.add('button', undefined, 'OK');
            btn02.size = buttonSize;
        var btn03 = panel02_group_4.add('button', undefined, 'OK');
            btn03.size = buttonSize;

        // --- Action ---
        function triggerDimension() {
        var newTextInputX = inDimensionX.text;
        var newTextInputY = inDimensionY.text;
        compParamChange(dimension, newTextInputX, newTextInputY);
        }
        function triggerFPS() {
        var newTextInput = inFps.text;
        compParamChange(fps, newTextInput);
        }
        function triggerDur() {
        var newTextInput = inDuration.text;
        compParamChange(duration, newTextInput);
        }

        //inDimensionX.onChange = triggerDimension;
        //inFps.onChange = triggerFPS;
        //inDuration.onChange = triggerDur;

        btn01.onClick = triggerDimension;
        btn02.onClick = triggerFPS;
        btn03.onClick = triggerDur;

    //  ================panel03================oo

        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());

    }
    //------------------------callback------------

    function fps(comp, input) {
        var inputDecimalFix = input.replace(/,/, ".");
        var newFpsFloat = parseFloat(inputDecimalFix).toFixed(3);
        //var newFpsFixed = newFpsFloat.toFixed(3);
        comp.frameRate = newFpsFloat;
    }

    function duration(comp, input) {
        var inputDecimalFix = input.replace(/,/, ".");
        var newDuration = parseFloat(inputDecimalFix).toFixed(2);
        comp.duration = newDuration;
    }
    
    /* function testNum(a) {
    var result;
    if (a > 0) {
    result = 'positive';
    } else {
    result = 'NOT positive';
    }
    return result;
    }*/

    /* function dimension(comp, inputX, inputY) {
        //var numX = comp.width;
        var numX = parseInt(inputX);
        var numY = parseInt(inputY);
        if (inputX == "undefined") {
        comp.width = numX;
        }
        if (inputY == "undefined") {
        comp.height = numY;
        }
    } */


    function dimension(comp, inputX, inputY) {
        //var numX = comp.width;
        var numX = parseInt(inputX);
        var numY = parseInt(inputY);
        if (inputX.length > 0) {
        comp.width = numX;
        }
        if (inputY.length > 0) {
        comp.height = numY;
        }
    }
        
    //------------------------------------
    function compParamChange(callback, input1, input2) {

    var undoTitle = "Change " + callback.name;
    app.beginUndoGroup(undoTitle);

    var selection = app.project.selection; // compositions

        if (selection.length == 0) {
            alert("Select a composition");
        } else {
            changeMulti(selection, callback, input1, input2);
        }

    app.endUndoGroup();
    

    //------------------------------------
        function changeMulti(array, callback, input1, input2) {
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            
            if (element instanceof CompItem) {

                callback(element, input1, input2);
                }
            }
        }
    }    
    //------------------------------------
    
})(this);

