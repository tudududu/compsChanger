//  js_compsChanger
//  copyright Jan Svatuska 2024
//  241018
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
//  v02d    Prejmenovator: event listener key "Enter" added to 'replace with'
//          Zkracovator: Opraven vypocet konce
//  v02e    Prejmenovator: event listener key "Enter" added to 'Apply'
//  v02f    == v02e
//  v02g    better describtion
//          Dimension: priprava na vylepseni - zatim nepouzito, vlozeny 2 funkce:
//          makeParentLayerOfAllUnparented(), moveParent()
//  v02h    better description, reorder
//  v02i    new order - one run. Vubec nefunguje.

//  v02x    vylepsit prejmenovator

//globals://
var message = "";

(function (thisObj) {
    //  globals: //
    var alertStr = "";
    //==================

    newPanel(thisObj);

    function newPanel(thisObj) {

        var vers = '02i';
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

     // ================panel01================oo
     // ================Prejmenovator================oo
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
        var txtInputReplace = panel01group02.add('edittext', undefined, '', /*{enterKeySignalsOnChange: false}*/);
            txtInputReplace.characters = 25;
        
        //  apply Button
        var btnApplyRename = panel01group02.add('button', undefined, 'Apply');
        
        // --- Action ---
        //  "Enter" v poli "Replace" spusti funkci
        txtInputReplace.addEventListener("keydown", function(kd) {pressed (kd)});
        function pressed(k) {
            if (k.keyName === "Enter") {
                //alert("You pressed " + k.keyName);
                triggerPrejmen();
            }
        }
        //  "Enter" na tlacitku spusti funkci
        btnApplyRename.addEventListener("keydown", function(kd) {pressed_02 (kd)});
        function pressed_02(k) {
            if (k.keyName === "Enter") {
                //alert("You pressed " + k.keyName);
                triggerPrejmen();
            }
            /*if (k.keyName === "Tab") {
                txtInputSearch.active = true;
                //alert("You pressed " + k.keyName);
            }*/
        }
        //  "Click" na tlacitko spusti funkci
        btnApplyRename.onClick = function () {
            triggerPrejmen();
            }
        function triggerPrejmen() {
            var oldString = txtInputSearch.text;
            var newString = txtInputReplace.text;
            compParamChange(prejmenOvator, oldString, newString);
        }
        
    //  ================panel02================oo
    //  input fields: comp dur, width, height, fps
    //  
        //  --------panel02--------fields--------
        var panel02 = win.add('panel', undefined, 'comp settings');
            panel02.orientation = 'row';
            panel02.alignChildren = 'right';
        var panel02_groupA = panel02.add('group', undefined, 'labely a pole');
            panel02_groupA.orientation = 'column';
            panel02_groupA.alignChildren = 'right';
        // var panel02_groupB = panel02.add('group', undefined, 'tlacitka');
        //     panel02_groupB.orientation = 'column';
        var panel02_group_01 = panel02_groupA.add('group', undefined, 'workAreaIn');
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
        var label = panel02_group_01.add('statictext', undefined, 'WorkAreaIn: ');
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
            } else {
            compParamChange(durationInDepht, newTextInput);
            }
        }
        function triggerCompIn() {
            var newIn = inWorkAreaIn.text;
            compParamChange(zkracovator, newIn);
        }
        // WorkAreaIn reaguje na onChange
        inWorkAreaIn.onChange = triggerCompIn;
        //  ostatni zamerne nikoli
        //inDimensionX.onChange = triggerDimension;
        //inFps.onChange = triggerFPS;
        //inDuration.onChange = triggerDur;
        
        //  OK button spousti vsechny funkce
        //  tohle predelat
        btn00.onClick = function () {
            doMain(this.parent);
            /* triggerCompIn();
            triggerDimension();
            triggerFPS();
            triggerDur(); */
            };

        //  ================panel02_konec================oo

        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());

    }
    //  ================UI_konec================oo

    //------------------------callback------------
        
    //------------------------------------
    function prejmenOvator(comp, oldString, newString) {
      //for (var index = 0; index < array.length; index++) {
          //var element = array[index]; //  uma item da seleção
          
          var oldName = comp.name; // nome da item
          var newName = oldName.replace(oldString, newString);
              
              comp.name = newName;
          //  fixing broken expressions due to the change of the name;              
          app.project.autoFixExpressions(oldName, newName);
    }
    
    //  set work area IN  //
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
    
    function width(comp, theDialog) {
        if (isNaN(parseInt(inputX))) {
            message = (message + "Not a number value for Width\r");
            theDialog.inDimensionX.text = ""; //empty field if it is bad so we don't try anymore
        } else {
        
            var oldWidth = comp.width;
            var newWidth = (parseInt(theDialog.inDimensionX.text));
            if ( (newWidth > 30000) || (newWidth < 4) ) {
                message = (message + "Value out of range for Width\r");
                theDialog.widthT.text = "";//empty field if it is bad so we don't try anymore
            } else {
                if (oldWidth != newWidth) {
                    item.width = newWidth;
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

    //---------------dimension----------------
    function makeParentLayerOfAllUnparented(theComp, newParent)
    {
    for (var i = 1; i <= theComp.numLayers; i++) {
        var curLayer = theComp.layer(i);
        if (curLayer.locked) {curLayer.locked = false;}
        if (curLayer != newParent && curLayer.parent == null) {
            curLayer.parent = newParent;
            }
        }
    }
    
    function moveParent(pa, axis, amt) {
        //null is at 000 anyway, so no math needed
        newPos = [0, 0, 0];
        newPos[axis] = amt;
        pa.position.setValue(newPos);
    }

    //---------------//----------------


    //---------------compDurationChange----------------
    //---change-only-selected-comp-duration----------------
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
    //---change-including-the-comps-content----------------
    function durationInDepht(selectedComp, newDuration) {
        const subCompArr = levelOrderTraversal(selectedComp);
        for (var i = 0; i < subCompArr.length; i++) {
            changeDuration(subCompArr[i], newDuration);
        }
    
    //  setting the dur for layers of the comp
    //  layer - set new out point
    //  layer-comp - set new duration to the source comp
    function changeDuration(comp, newDuration) {
        
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
    //  iterating through the subComps
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
    //  main starter function calling the looping function changeMulti()
    // function compParamChange(callback, input1, input2) {
    function compParamChange(callback, theDialog) {
    
    var undoTitle = "Change " + callback.name;
    app.beginUndoGroup(undoTitle);

    var selection = app.project.selection; // compositions

        if (selection.length == 0) {
            alert("Select a composition");
        } else {
            // changeMulti(selection, callback, input1, input2);
            changeMulti(selection, callback, theDialog);
        }

    app.endUndoGroup();
    
    //------------------------------------
        //  implementing the particular functions for selected comps
        function changeMulti(array, callback, theDialog) {
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            
            // if (callback !== prejmenOvator) {
            //     if (element instanceof CompItem) {  //  zbytek pracuje jen na comps
                // callback(element, input1, input2);
                doMain(element, theDialog);
                //     }
                // } else {
                //     callback(element, input1, input2);  // prejmenovator neni omezen
                // }
            }
        }
    }
    //------------------------------------
        function doMain(comp, theDialog) {
            if (theDialog.inDimensionX.text != "") {
                width(selection[0], theDialog);
            }
        }

})(this);
