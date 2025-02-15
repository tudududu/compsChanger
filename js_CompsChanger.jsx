/*
js_compsChanger
copyright Jan Svatuska 2024
241210
v01a    Dimension section reposition 3D layer, but not 2D
        nefunguje y pokud x = 0, nebo neni zadano
v01b    Condition for dimension: if (inputX.length > 0)
        Dimension rozchozeno, lze zadat jen y stranu,
        merime delku retezce, (null a undefined nefungovalo)
v01d    Pridan ZkracOvator
v01e    Zmena UI - zkracovator do comp panelu
        Zkracovator ma nastavenou default hodnotu 1
        zahada: pri default hodnote nereaguje na btn, samostatne (v01d) reagoval
        reaguje az po nastaveni 0 a pak dalsiho cisla a jeste spatne pocita konec
        patrani: funguje pokud btn00 spousti jen triggerCompIn (ostatni funkce vypnute)
        nalez: ostatni fce vrati chybu, protoze nemaji osetreny chybejici vstup
v02a    reorganizace, zkracovator spatne pocita konec, nic jineho nefunguje
v02b    prejmenovator omezen pouze na comps
v02c    prejmenovator rozsiren na slozky a soubory
        Opraveno - Zkracovator zastavoval cinnost na kompozicich kratsich nez 01s
        Zkracovator stale spatne pocita konec
v02d    Prejmenovator: event listener key "Enter" added to 'replace with'
        Zkracovator: Opraven vypocet konce
v02e    Prejmenovator: event listener key "Enter" added to 'Apply'
v02f    == v02e
v02g    better describtion
        Dimension: priprava na vylepseni - zatim nepouzito, vlozeny 2 funkce:
        makeParentLayerOfAllUnparented(), moveParent()
v02h    better description, reorder
v02i    new order - one run. Vubec nefunguje.

v03     Uplne predelat podle vzoru Design 02 (crg)
        Z UI jednotlive funkce nespoustime naprimo, ale
        spoutime centralni funkci, ktera je bud obsahuje nebo spousti,
        podle toho jestli maji zadany vstup.
        Do funkce spoustene v UI dosazujeme (this.parent), 
        Ve funci pod nazvem promenne, uvnitr pristupujem k hodnotam 
        napr. takto: theDialog.inDimensionX.text
v03x    Prejmenovator: vylepsit (crg)

v03a    Rozchozeno. Dimension: Width, funguje 3D layer, tj. je bez korekce Nullem.
v03b    Dimension: Zprovozneno pro 2D i 3D layer. Implementaci re-centeringu.
v03c    Info message zprovoznena.

*/

//===========globals
var vers = '03b';
var title = 'compsChanger (v' + vers + ')';
var message = "";
//==================
    
(function (thisObj) {
    newPanel(thisObj);

    function newPanel(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj 
        : new Window('palette', title, undefined);
        
        win.orientation = 'column';
        win.alignChildren = 'fill';
        win.preferredSize = [200, 300]; // if not - the size is auto
        var buttonSize = [30, 23];

        // ================panel01================oo
        // ================Prejmenovator================oo
        
        var groupOne = win.add('group');
            groupOne.orientation = 'column';
            groupOne.alignChildren = 'fill';
        //  input text
        var label01a = groupOne.add('statictext', undefined, 'Width: ');
        groupOne.inDimensionX = groupOne.add('edittext', undefined, undefined);
        groupOne.inDimensionX.characters = 10;
        var label01a = groupOne.add('statictext', undefined, 'Heyght: ');
        groupOne.inDimensionY = groupOne.add('edittext', undefined, undefined);
        groupOne.inDimensionY.characters = 10;
        
        //  apply Button
        groupOne.okBtn = groupOne.add('button', undefined, 'Apply', {name: "ok"});
        
        // --- Action ---
        groupOne.okBtn.onClick = function () {
            doMain(this.parent); // Calls doMain with the win object
        }

        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }

    //---------------------------------
    function makeParentLayerOfAllUnparented(theComp, newParent)
    {
        for (var i = 1; i <= theComp.numLayers; i++) {
            var curLayer = theComp.layer(i);
            if (curLayer.locked) {curLayer.locked = false;}
            if (curLayer != newParent && curLayer.parent == null && curLayer.threeDLayer != true) {
                curLayer.parent = newParent;
            }
        }
    }
    // parent = the 'null3DLayer' created for this re-centering
    // axis = direction; 0 = x for witdh, 1 = y for height
    // shift = how much to shift the null
    function moveParent(parent, axis, shift) {
        //null is at 000 anyway, so no math needed
        newPos = [0, 0, 0];
        newPos[axis] = shift;
        parent.position.setValue(newPos);
    }
    ///// 2- width
    // limit=30000
    function width(item, theDialog) {
    // if (theDialog.inDimensionX.text != "") {
        if (isNaN(parseInt(theDialog.inDimensionX.text))) {
            message = (message + "Not a number value for Width\r");
            theDialog.inDimensionX.text = ""; //empty field if it is bad so we don't try anymore
        } else {
            var oldWidth = item.width;
            var newWidth = (parseInt(theDialog.inDimensionX.text));
            if ( (newWidth > 30000) || (newWidth < 4) ) {
                message = (message + "Value out of range for Width\r");
                theDialog.inDimensionX.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                if (oldWidth != newWidth) {
                    item.width = newWidth;
                    // message = (message + "Value is OK\r"); // test messagae
                    // re-centering: na rozdil od CRG je stale zapnuty
                    // if 'recenter' checkbox is checked:
                    // if (theDialog.reCenterCheck.value) {
                        thisMuch = (-1 * (oldWidth - newWidth)) / 2;
                        null3DLayer = item.layers.addNull();
                        null3DLayer.threeDLayer = true;
                        doomedNullSrc = null3DLayer.source; // null project item, so that it could be removed
                        null3DLayer.position.setValue([0, 0, 0]);
                        // Set null3DLayer as parent of all layers that don't have parents.  
                            makeParentLayerOfAllUnparented(item, null3DLayer);
                            //null, axis, amt
                            moveParent(null3DLayer, 0, thisMuch);
                        null3DLayer.remove();
                        doomedNullSrc.remove();
                        // }
                    }
                }
            // alert(message);
            // theDialog.inDimensionX.text = "";//empty field if it is bad so we don't try anymore
            // }
        }
    }
    ///// 3- height
    // limit=30000
    function height(item, theDialog) {
        // if (theDialog.inDimensionX.text != "") {
            if (isNaN(parseInt(theDialog.inDimensionY.text))) {
                message = (message + "Not a number value for Height\r");
                theDialog.inDimensionY.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                var oldHeight = item.height;
                var newHeigh = (parseInt(theDialog.inDimensionY.text));
                if ( (newHeigh > 30000) || (newHeigh < 4) ) {
                    message = (message + "Value out of range for Heigh\r");
                    theDialog.inDimensionY.text = ""; //empty field if it is bad so we don't try anymore
                } else {
                    if (oldHeight != newHeigh) {
                        item.height = newHeigh;
                        // message = (message + "Value is OK\r"); // test messagae
                        // if 'recenter' checkbox is checked:
                        // if (theDialog.reCenterCheck.value) {
                            thisMuch = (-1 * (oldHeight - newHeigh)) / 2;
                            null3DLayer = item.layers.addNull();
                            null3DLayer.threeDLayer = true;
                            doomedNullSrc = null3DLayer.source; // null project item, so that it could be removed
                            null3DLayer.position.setValue([0, 0, 0]);
                            // Set null3DLayer as parent of all layers that don't have parents.  
                            makeParentLayerOfAllUnparented(item, null3DLayer);
                            //null, axis, amt
                            moveParent(null3DLayer, 1, thisMuch);
                            null3DLayer.remove();
                            doomedNullSrc.remove();
                            // }
                        }
                    }
                // alert(message);
                // theDialog.inDimensionY.text = "";//empty field if it is bad so we don't try anymore
                // }
            }
        }
    //------------------------------------
    // main starter function calling the looping function changeMulti()
    // function compParamChange(callback, input1, input2) {
    function processIntro(theDialog) {
    // var undoTitle = "Change " + callback.name;
    // app.beginUndoGroup(undoTitle);
    var selection = app.project.selection; // compositions

        if (selection.length == 0) {
            alert("Select a composition");
        } else {
            processLoop(selection, theDialog);
        }
    // app.endUndoGroup();

            //  implementing the particular functions for selected comps
        function processLoop(array, theDialog) {
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            
            
            if (element instanceof CompItem) {  //  zbytek pracuje jen na comps
                if (theDialog.inDimensionX.text != "") {
                    width(element, theDialog);
                }
                if (theDialog.inDimensionY.text != "") {
                    height(element, theDialog);
                    }
                if (message != "") {
                    alert("The following problems were found (these settings were not changed!):\r" + message);
                    }
                }
            // } else {
            //     callback(element, input1, input2);  // prejmenovator neni omezen
            // }
            }
        }
    }

    function doMain(theDialog) {
    app.beginUndoGroup("Change Selected Comps");
        
        processIntro(theDialog);

    app.endUndoGroup();
    }

})(this);