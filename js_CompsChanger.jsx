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
        napr. takto: theDialog.txt_in_x.text
v03x    Prejmenovator: vylepsit (crg)

v03a    Rozchozeno. Dimension: Width, funguje 3D layer, tj. je bez korekce Nullem.
v03b    Dimension: Zprovozneno pro 2D i 3D layer. Implementaci re-centeringu.
v03c    Info message zprovoznena.
v03d    Prejmenovator: Pridan. UI: Dimension a prejmenovator rozchozeno, ale za cenu ztraty deleni na panly a skupiny.
v03e
Request for Copilot: I have this Adobe After Effects script with UI panel. It has 2 functions: Renamer and Dimension. I have tried this script design where the functions can read the input from UI by passing the dialog object. The script is working, but I have a problem with the UI design. I would like to have the script with the same functionality but with the UI design where the functions are separated into panels and groups. I have tried to do it, but I have failed. Can you help me with this? I can provide you with the script. Thank you.
*/

//===========globals
var vers = '03b';
var title = 'compsChanger (v' + vers + ')';
var message = "";
//==================
    
(function (thisObj) {
    newPanel(thisObj);
    //========================UI========================
    function newPanel(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj 
        : new Window('palette', title, undefined);
        
        win.orientation = 'column';
        win.alignChildren = 'fill';
        win.preferredSize = [200, 300]; // if not - the size is auto
        var buttonSize = [30, 23];

        // ================panel01================oo
        // ================Prejmenovator================oo
        var panel01 = win.add('panel', undefined, 'Prejmenovator');
            panel01.orientation = 'column';
            panel01.alignChildren = 'fill';
        var p01g01 = panel01.add('group');
            p01g01.orientation = 'column';
            p01g01.alignChildren = 'fill';
        //  input text
        var label_01 = p01g01.add('statictext', undefined, 'Search for:');
        panel01.txt_in_search = p01g01.add('edittext', undefined, '');
        panel01.txt_in_search.characters = 25;
        var label_02 = p01g01.add('statictext', undefined, 'Replace with:');
        panel01.txt_in_replace = p01g01.add('edittext', undefined, '');
        panel01.txt_in_replace.characters = 25;
        //  apply Button
        panel01.btnRename = p01g01.add('button', undefined, 'Apply', {name: "Prejmenovator"});
        
        //  ================panel02================oo
        //  ================compSettings================oo
        var panel02 = win.add('panel', undefined, 'Dimension');
            panel02.orientation = 'column';
            panel02.alignChildren = 'fill';
        var p02g01 = panel02.add('group');
            p02g01.orientation = 'column';
            p02g01.alignChildren = 'fill';
        //  input text
        var label01a = p02g01.add('statictext', undefined, 'Width: ');
        panel02.txt_in_x = p02g01.add('edittext', undefined, '');
        panel02.txt_in_x.characters = 10;
        var label01b = p02g01.add('statictext', undefined, 'Height: ');
        panel02.txt_in_y = p02g01.add('edittext', undefined, '');
        panel02.txt_in_y.characters = 10;
        //  apply Button
        panel02.btnCompSet = p02g01.add('button', undefined, 'Apply', {name: "compSettings"});
        
        // --- Action ---
        panel01.btnRename.onClick = function () {
            doMain(this.parent.parent); // Calls doMain with the win object
        }
        panel02.btnCompSet.onClick = function () {
            doMain(this.parent.parent); // Calls doMain with the win object
        }
        
        //  ================window================oo
        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }

    //========================function========================

    
    
    function doMain(theDialog) {
        app.beginUndoGroup("Change Selected Comps");
        
        var selection = app.project.selection; // compositions

        if (selection.length == 0) {
            alert("Select a composition");
        } else {
            for (var index = 0; index < selection.length; index++) {
            var item = selection[index];
                
        if (item instanceof CompItem) {  //  zbytek pracuje jen na comps



        //========================callback========================
        ///// 1- prejmenOvator
        // function prejmenOvator(item, theDialog) {
        if (theDialog.txt_in_search.text != "") {
            var oldString = theDialog.txt_in_search.text;
            var newString = theDialog.txt_in_replace.text;

            var oldName = item.name; // nome da item
            var newName = oldName.replace(oldString, newString);
                
                item.name = newName;
            //  fixing broken expressions due to the change of the name;              
            app.project.autoFixExpressions(oldName, newName);
        }



        //------------------------------------dimension
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
        // function width(item, theDialog) {
        if (theDialog.txt_in_x.text != "") {
            if (isNaN(parseInt(theDialog.txt_in_x.text))) {
                message = (message + "Not a number value for Width\r");
                theDialog.txt_in_x.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                var oldWidth = item.width;
                var newWidth = (parseInt(theDialog.txt_in_x.text));
                if ( (newWidth > 30000) || (newWidth < 4) ) {
                    message = (message + "Value out of range for Width\r");
                    theDialog.txt_in_x.text = ""; //empty field if it is bad so we don't try anymore
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
                }
            }
        // }
        ///// 3- height
        // limit=30000

        if (theDialog.txt_in_y.text != "") {
            if (isNaN(parseInt(theDialog.txt_in_y.text))) {
                message = (message + "Not a number value for Height\r");
                theDialog.txt_in_y.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                var oldHeight = item.height;
                var newHeigh = (parseInt(theDialog.txt_in_y.text));
                if ( (newHeigh > 30000) || (newHeigh < 4) ) {
                    message = (message + "Value out of range for Heigh\r");
                    theDialog.txt_in_y.text = ""; //empty field if it is bad so we don't try anymore
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
                }
            }
            //------------------------------------
            }
        }
    }   

        app.endUndoGroup();
    }

})(this);