//  js_compsChanger
//  copyright Jan Svatuska 2024
//  240530
//  v01a    Dimension section reposition 3D layer, but not 2D
//          nefunguje y pokud x = 0, nebo neni zadano
//  v01b    Condition for dimension: if (inputX.length > 0)
//          Dimension rozchozeno, lze zadat jen y stranu,
//          merime delku retezce, (null a undefined nefungovalo)
//  v01d    Pridan ZkracOvator
//  v01e    Zmena UI - zkracovator do comp panelu
//          Zkracovator ma nastavenou default hodnotu 1
//          zahada: pri default hodnote nereaguje na btn, samostatne (v01d) reagoval
//          reaguje az po nastaveni 0 a pak dalsiho cisla a jeste spatne pocita konec
//          patrani: funguje pokud btn00 spousti jen triggerCompIn (ostatni funkce vypnute)
//          nalez: ostatni fce vrati chybu, protoze nemaji osetreny chybejici vstup
//  v02a    reorganizace, zkracovator spatne pocita konec, nic jineho nefunguje
//  v02b    prejmenovator omezen pouze na comps
//  v02c    prejmenovator rozsiren na slozky a soubory
//          Opraveno - Zkracovator zastavoval cinnost na kompozicich kratsich nez 01s
//          Zkracovator stale spatne pocita konec
//  v02d    add event listener key "Enter" to 'replace with'
//          vylepsit prejmenovator

(function (thisObj) {
    //  globals: //
    var alertStr = "";
    //==================

    newPanel(thisObj);

    function newPanel(thisObj) {

        var vers = '02c';
        var title = 'compChanger_v' + vers + '';

        var win = (thisObj instanceof Panel) 
        ? 
        thisObj
        :
        new Window('palette', title, undefined);
        
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
            triggerPrejmen();
            }
        function triggerPrejmen() {
            var oldString = txtInputSearch.text;
            var newString = txtInputReplace.text;
            compParamChange(prejmenOvatorEngine, oldString, newString);
        }
        
    //  ================panel02================oo
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
            panel02_groupB.orientation = 'column';
        var panel02_group_01 = panel02_groupA.add('group', undefined, 'width');
            panel02_group_01.orientation = 'row';
        var panel02_group_0 = panel02_groupA.add('group', undefined, 'width');
            panel02_group_0.orientation = 'row';
        var panel02_group_1 = panel02_groupA.add('group', undefined, 'height');
            panel02_group_1.orientation = 'row';
        var panel02_group_2 = panel02_groupA.add('group', undefined, 'Framerate');
            panel02_group_2.orientation = 'row';
        var panel02_group_3 = panel02_groupA.add('group', undefined, 'Duration');
            panel02_group_3.orientation = 'row';
                
        //  label
        //var label01 = panel02_group_0.add('statictext', undefined, 'Dimension: ');
        var label = panel02_group_01.add('statictext', undefined, 'Start: ');
        var label01a = panel02_group_0.add('statictext', undefined, 'Width: ');
        var label01b = panel02_group_1.add('statictext', undefined, 'Height: ');
        var labelTwo = panel02_group_2.add('statictext', undefined, 'Framerate: ');
        var labelThree = panel02_group_3.add('statictext', undefined, 'Duration: ');
        //  input text
        var inWorkAreaIn = panel02_group_01.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inWorkAreaIn.characters = 10;
        var inDimensionX = panel02_group_0.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDimensionX.characters = 10;
        var inDimensionY = panel02_group_1.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDimensionY.characters = 10;
        var inFps = panel02_group_2.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inFps.characters = 10;
        var inDuration = panel02_group_3.add('edittext', undefined, undefined, {enterKeySignalsOnChange: false});
            inDuration.characters = 10;
        var durChkBx = panel02_groupA.add('checkbox', undefined, 'Duration including subComps');
            durChkBx.value = false;
        //  apply Button
        var btn00 = panel02_groupA.add('button', undefined, 'OK');

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
            if (!durChkBx.value) {
            compParamChange(duration, newTextInput);
            //durationInDepht(selectedComp, newDuration);
            } else {
            compParamChange(durationInDepht, newTextInput);
            }
        }
        function triggerCompIn() {
            var newIn = inWorkAreaIn.text;
            compParamChange(zkracovator, newIn);
        }

        inWorkAreaIn.onChange = triggerCompIn;
        //inDimensionX.onChange = triggerDimension;
        //inFps.onChange = triggerFPS;
        //inDuration.onChange = triggerDur;

        btn00.onClick = function () {
            triggerCompIn();
            triggerDimension();
            triggerFPS();
            triggerDur();
            };

    //  ================panel03================oo

        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());

    }
    //------------------------callback------------
        
    //------------------------------------
    function prejmenOvatorEngine(comp, oldString, newString) {
      //for (var index = 0; index < array.length; index++) {
          //var element = array[index]; //  uma item da seleção
          
          var oldName = comp.name; // nome da item
          var newName = oldName.replace(oldString, newString);
              
              comp.name = newName;
          //  fixing broken expressions due to the change of the name;              
          app.project.autoFixExpressions(oldName, newName);
    }
    
    //  work area IN
    function zkracovator(comp, startTimeL) {
        if (startTimeL != "") {
            if(isNaN(parseFloat(startTimeL))) {
                alertStr = ("Not a number for Width\r");
                inWorkAreaIn.text = "";    // clear field in case of NaN input
            } else {
        var compDur = comp.duration;
        var compDurFixed = compDur.toFixed(0); //round to integer
        if (compDur > 1) {  //  fix stopping on comps shorter than 01s
        comp.workAreaStart = startTimeL;
        comp.workAreaDuration = compDurFixed - startTimeL;
                }
            }
        }
    }
    
    function fps(comp, input) {
        if (input != "") {
            if(isNaN(parseFloat(input))) {
                alertStr = ("Not a number for Width\r");
                inFps.text = "";    // clear field in case of NaN input
            } else {
        var inputDecimalFix = input.replace(/,/, ".");
        var newFpsFloat = parseFloat(inputDecimalFix).toFixed(3);
        //var newFpsFixed = newFpsFloat.toFixed(3);
        comp.frameRate = newFpsFloat;
            }
        }
    }

    function duration(comp, input) {
        if (input != "") {
            if(isNaN(parseFloat(input))) {
                alertStr = ("Not a number for Duration\r");
                inDuration.text = "";    // clear field in case of NaN input
            } else {
        var inputDecimalFix = input.replace(/,/, ".");
        var newDuration = parseFloat(inputDecimalFix).toFixed(2);
        comp.duration = newDuration;
            }
        }
    }
    
    function dimension(comp, inputX, inputY) {
        var numX = parseInt(inputX);
        var numY = parseInt(inputY);
        if (inputX.length > 0) {
        comp.width = numX;
        }
        if (inputY.length > 0) {
        comp.height = numY;
        }
    }
    


    //---------------compDurationChange----------------
    //---------------core----------------
    function durationInDepht(selectedComp, newDuration) {
        const subCompArr = levelOrderTraversal(selectedComp);
        for (var i = 0; i < subCompArr.length; i++) {
            layerInspection(subCompArr[i], newDuration);
        }
    

    //  setting the dur for layers of the comp
    function layerInspection(comp, newDuration) {
        
        var compLayerArr = comp.layers; // prohlidka vrstev
        comp.duration = newDuration;

        for (var j = 1; j <= compLayerArr.length; j++) {
            var layerSource = compLayerArr[j].source;
            var layer = compLayerArr[j];
            
            if (layerSource instanceof CompItem) {
                layerSource.duration = newDuration;
            }
                layer.outPoint = newDuration;
        }
    }

    function levelOrderTraversal(root) {
        if (root == null)
            return;

        // Standard level order traversal code
        // using queue
        var arr = [];
        var q = []; // Create a queue
        q.push(root); // push root 
        while (q.length != 0) {
            var n = q.length;

            // If this node has children
            while (n > 0) {
                // Dequeue an item from queue
                // and print it
                var item = q[0];
                q.shift();
                arr.push(item);
                //console.log(p.key + " ");
                var itemLayers = item.layers;
                // push all children of the dequeued item
                for (var i = 1; i <= item.layers.length; i++) {
                    if (item.layers[i].source instanceof CompItem) {
                    q.push(item.layers[i].source);
                        }
                    }
                n--;
            }
        }
        return arr;
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
            
            if (callback !== prejmenOvatorEngine) {
                if (element instanceof CompItem) {

                callback(element, input1, input2);
                    }
                } else {
                    callback(element, input1, input2);
                }
            }
        }
    }
    //------------------------------------
    




})(this);

