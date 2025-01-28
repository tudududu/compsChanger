/*
js_compsChanger
copyright Jan Svatuska 2024
241015
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
        Dimension: zprovoznit pro 2D i 3D

v03a    Rozchozeno. Dimension: Width, funguje 3D layer, tj. je bez korekce Nullem.

*/
(function (thisObj) {
    //===========globals
    var vers = '03a';
    var title = 'compsChanger (v' + vers + ')';
    var message = "";
    //==================
    newPanel(thisObj);

    function newPanel(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj 
        : new Window('palette', title, undefined);
        //  win.preferredSize = [250, 300]; //if not on the size is auto

        var groupOne = win.add('group');
            groupOne.orientation = 'column';
            groupOne.alignChildren = 'fill';
        //  input text
        var label01a = groupOne.add('statictext', undefined, 'Width: ');
        groupOne.inDimensionX = groupOne.add('edittext', undefined, undefined);
        groupOne.inDimensionX.characters = 10;
        
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

    function width(comp, theDialog) {
    if (theDialog.inDimensionX.text != "") {
        if (isNaN(parseInt(theDialog.inDimensionX.text))) {
            message = (message + "Not a number value for Width\r");
            theDialog.inDimensionX.text = ""; //empty field if it is bad so we don't try anymore
        } else {
            var oldWidth = comp.width;
            var newWidth = (parseInt(theDialog.inDimensionX.text));
            if ( (newWidth > 30000) || (newWidth < 4) ) {
                message = (message + "Value out of range for Width\r");
                theDialog.inDimensionX.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                if (oldWidth != newWidth) {
                    comp.width = newWidth;
                    message = (message + "Value is OK\r");
                    }
                }
            // alert(message);
            // theDialog.inDimensionX.text = "";//empty field if it is bad so we don't try anymore
            }
        }
    }
    //------------------------------------
        //  implementing the particular functions for selected comps
        function processLoop(array, theDialog) {
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            
            
            if (element instanceof CompItem) {  //  zbytek pracuje jen na comps
                width(element, theDialog);
                }
            // } else {
            //     callback(element, input1, input2);  // prejmenovator neni omezen
            // }
            }
        }
    //------------------------------------
    //  main starter function calling the looping function changeMulti()
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
    }


    function doMain(theDialog) {
    app.beginUndoGroup("Change Selected Comps");
        var selection = app.project.selection; // compositions

        processIntro(theDialog);

    app.endUndoGroup();
    }

})(this);