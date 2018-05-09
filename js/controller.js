function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function Controller(scene) {
    this.pointsEnabled = true;
    this.scene = scene;
    this.choicesPaths = new Choices('#choicesPaths', {
        removeItemButton: true,
        choices: []});
    var self = this;
    this.choicesPaths.passedElement.addEventListener('addItem', function(event) {
        self.addLine(event.detail.value);
    });

    this.choicesPaths.passedElement.addEventListener('removeItem', function(event) {
        self.updateLines(1, event.detail.value);
    });


    this.choicesIps = new Choices('#choicesIps', {
        removeItemButton: true,
        choices: []});
    this.choicesIps.passedElement.addEventListener('addItem', function(event) {
        //found all paths with this ip
        self.pathFromElse(event.detail.value,addresses,false,false);
    });

    this.choicesIps.passedElement.addEventListener('removeItem', function(event) {
        self.updateLines(2, event.detail.value);
    });


    this.choicesGeos = new Choices('#choicesGeos', {
        removeItemButton: true,
        choices: []});
    this.choicesGeos.passedElement.addEventListener('addItem', function(event) {
        //found additional paths with this geo informs
        self.pathFromElse(event.detail.value,geos,true,false);
    });

    this.choicesGeos.passedElement.addEventListener('removeItem', function(event) {
        self.updateLines(3, event.detail.value);
    });
}

Controller.prototype.pathFromElse = function (keyName,source, isGeos , isReturn) {
    var addedPaths;
    if (isGeos) {
        addedPaths = source[keyName].array;
    }
    else {
        addedPaths = source[keyName];
    }
    if (isReturn) {
        return addedPaths;
    }
    else {
        for (var i = 0; i < addedPaths.length; i++) {
            this.choicesPaths.setValueByChoice(addedPaths[i].name);
        }
    }
};

Controller.prototype.compareAndRemove = function (element,elementLocation,isGeos) {

    //removing from IPs, generate list of paths needed to remove
    var elementPaths = this.pathFromElse(element,elementLocation,isGeos,true);
    var pathsValues = this.choicesPaths.getValue(true);
    //check if the path is already removed and if no removed it

    console.log(elementPaths);
    console.log(pathsValues);

    for (var i = 0; i < elementPaths.length; i++) {
        for (var j = 0; j < pathsValues.length; j++){
            if (pathsValues[j] === elementPaths[i].name) {
                this.choicesPaths.removeItemsByValue(pathsValues[j]);
                break;
            }
        }
    }
};

Controller.prototype.addLine = function (pathName) {
    //console.log("Adding path: " + pathName);
    //add options
    var select = document.createElement("select");
    select.type = "select";
    select.onchange = function () {
        main.controller.modifyLine(pathName,false);
    };
    var opt1 = document.createElement("option");
    opt1.value = "line";
    opt1.text = "line";
    var opt2 = document.createElement("option");
    opt2.value = "point";
    opt2.text = "point";
    var opt3 = document.createElement("option");
    opt3.value = "sphere";
    opt3.text = "sphere";
    select.appendChild(opt1);
    select.appendChild(opt2);
    select.appendChild(opt3);

    var color = document.createElement("input");
    color.type = "color";
    color.oninput = function (ev) {
        main.controller.modifyLine(pathName,false);
    };
    color.value = getRandomColor();
    color.style.height = "20px";
    color.style.marginLeft = "2px";

    var label = document.createElement("label");
    label.innerHTML = " " + pathName;

    var divPaths = document.getElementById("pathsCorrect");
    var parentDiv = document.createElement("div");
    parentDiv.id = pathName;
    divPaths.appendChild(parentDiv);
    parentDiv.appendChild(select);
    parentDiv.appendChild(color);
    parentDiv.appendChild(label);

    //add line to threejs
    main.lineGenerator.generateLines(paths[pathName],color.value,this.pointsEnabled,main.cameraZoom,main.lineGenerator.styleEnum.line);

};

Controller.prototype.addAll = function () {
    //add everything from paths
    var selectElement = document.getElementById("selectGroup");
    var selectValue = selectElement.value;
    console.log(selectValue);
    if (selectValue === "all"){
        for (var key in paths) {
            this.choicesPaths.setValueByChoice(key);
        }
    }
    else {
        for (var key in paths) {
            console.log(key + " " +selectValue);
            if (key.indexOf(selectValue) !== -1) {
                console.log("found it");
                this.choicesPaths.setValueByChoice(key);
            }
        }
    }
};


Controller.prototype.remove = function (pathName) {
    main.lineGenerator.removeLine(pathName);
    var divPaths = document.getElementById(pathName);
    divPaths.parentNode.removeChild(divPaths);
};

Controller.prototype.removeAll = function (reloadChoices) {
    console.log("REMOVE ALL");
    if (reloadChoices) {
        this.loadChoices();
    }
    main.lineGenerator.removeAll();

    //remove div and create it again
    var divPaths = document.getElementById("pathsCorrect");
    var divSelect = divPaths.parentNode;
    divSelect.removeChild(divPaths);
    divPaths = document.createElement("div");
    divPaths.id = "pathsCorrect";
    divSelect.appendChild(divPaths);

    //create first elements
    var select = document.createElement("select");
    select.id = "enableAllSelect";
    select.type = "select";
    select.onchange = function () {
        main.controller.modifyLine("",true);
    };
    var opt1 = document.createElement("option");
    opt1.value = "line";
    opt1.text = "line";
    var opt2 = document.createElement("option");
    opt2.value = "point";
    opt2.text = "point";
    var opt3 = document.createElement("option");
    opt3.value = "sphere";
    opt3.text = "sphere";
    select.appendChild(opt1);
    select.appendChild(opt2);
    select.appendChild(opt3);

    var color = document.createElement("input");
    color.id = "enableAllColor";
    color.type = "color";
    color.style.height = "20px";
    color.style.marginLeft = "2px";
    color.oninput = function (ev) {
        main.controller.modifyLine("",true);
    };
    color.value = "#ffffff";

    var label = document.createElement("label");
    label.innerHTML = " Enable all";

    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.id = "pointsEnable";
    checkbox1.checked = this.pointsEnabled;
    checkbox1.onclick = function (ev) {
        main.controller.modifyLine("",true);
    };
    var text1 = document.createTextNode('Points');

    var checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.id = "refreshingEnabled";
    checkbox2.checked = true;
    var text2 = document.createTextNode('Refreshing');

    var parentDiv = document.createElement("div");
    //add created div to the select div
    divPaths.appendChild(parentDiv);
    parentDiv.appendChild(select);
    parentDiv.appendChild(color);
    parentDiv.appendChild(label);
    parentDiv.appendChild(checkbox1);
    parentDiv.appendChild(text1);
    parentDiv.appendChild(checkbox2);
    parentDiv.appendChild(text2);

};

Controller.prototype.refreshAll = function () {
    //remove all and reload all lines
    main.lineGenerator.removeAll();
    var pathsValues = this.choicesPaths.getValue(true);
    for (var j = 0; j < pathsValues.length; j++){
        this.reloadLine(pathsValues[j]);
    }
};

Controller.prototype.modifyLine = function (pathName, allPaths) {
    console.log("MODIFY" + pathName + " " + allPaths);
    if (allPaths) {
        var checkboxPointsEnabled = document.getElementById("pointsEnable");
        if (checkboxPointsEnabled.checked) {
            this.pointsEnabled = true;
        }
        else {
            this.pointsEnabled = false;
        }


        //set all divs to the enableAll settings
        var select = document.getElementById("enableAllSelect").value;
        var color = document.getElementById("enableAllColor").value;

        var divConfig = document.getElementById("pathsCorrect");
        var allDivs = divConfig.getElementsByTagName("div");
        for (var i = 1; i < allDivs.length; i++) {
            var selectConfig = allDivs[i].getElementsByTagName("select");
            selectConfig[0].value = select;
            var colorConfig = allDivs[i].getElementsByTagName("input");
            colorConfig[0].value = color;
        }

        //remove all and reload all lines
        main.lineGenerator.removeAll();
        var pathsValues = this.choicesPaths.getValue(true);
        for (var j = 0; j < pathsValues.length; j++){
            this.reloadLine(pathsValues[j]);
        }
    }
    else {
        //modify just one line
        main.lineGenerator.removeLine(pathName);
        this.reloadLine(pathName);
    }
};

Controller.prototype.reloadLine = function (pathName) {
    //function to load line setting and write it to viewer, this do not remove old lines
    var divConfig = document.getElementById(pathName);
    var selectConfig = divConfig.getElementsByTagName("select");
    var colorConfig = divConfig.getElementsByTagName("input");
    if (selectConfig[0].value === "line") {
        main.lineGenerator.generateLines(paths[pathName],colorConfig[0].value,
            this.pointsEnabled,main.cameraZoom,main.lineGenerator.styleEnum.line)
    }
    else if (selectConfig[0].value === "point") {
        main.lineGenerator.generateLines(paths[pathName],colorConfig[0].value,
            this.pointsEnabled,main.cameraZoom,main.lineGenerator.styleEnum.point)
    }
    else if (selectConfig[0].value === "sphere") {
        main.lineGenerator.generateLines(paths[pathName],colorConfig[0].value,
            this.pointsEnabled,main.cameraZoom,main.lineGenerator.styleEnum.sphere)
    }
};

Controller.prototype.updateLines = function (intFunction, element) {

    console.log("UPDATE_LINES" + intFunction + " " + element);

    if (intFunction === 1) {
        //removing from three.js
        var pathName = element;
        this.remove(pathName);
        //remove extra paths from IPs and GEOS
        var addressesValues1 = this.choicesIps.getValue(true);
        for (var i =0 ; i < addressesValues1.length; i++) {
            var addressesPaths1 = this.pathFromElse(addressesValues1[i],addresses,false,true);
            //check if this address contains removed path
            for (var j = 0; j < addressesPaths1.length; j++) {
                if (pathName === addressesPaths1[j].name) {
                    this.choicesIps.removeItemsByValue(addressesValues1[i]);
                    break;
                }
            }
        }
        var geosValues1 = this.choicesGeos.getValue(true);
        for (var k =0 ; k < geosValues1.length; k++) {
            var geosPaths1 = this.pathFromElse(geosValues1[k],geos,true,true);
            //check if this geo contains removed path
            for (var l = 0; l < geosPaths1.length; l++) {
                if (pathName === geosPaths1[l].name) {
                    this.choicesGeos.removeItemsByValue(geosValues1[k]);
                    break;
                }
            }
        }

    }
    else if (intFunction === 2) {
        this.compareAndRemove(element,addresses,false);
    }
    else if (intFunction === 3) {
        this.compareAndRemove(element,geos,true);
    }
};

Controller.prototype.loadChoices = function () {
    this.choicesPaths.clearStore();
    this.choicesIps.clearStore();
    this.choicesGeos.clearStore();
    //paths loading
    var arrayPaths = [];
    for (var key3 in paths) {
        arrayPaths.push({value: key3, label:key3});
    }
    this.choicesPaths.setChoices(arrayPaths,'value','label', true);

    //IP loading
    var arrayIps = [];
    for (var key4 in addresses) {
        arrayIps.push({value: key4, label:key4});
    }
    this.choicesIps.setChoices(arrayIps,'value','label', true);

    //GEO loading
    var arrayGeos = [];
    for (var key5 in geos) {
        arrayGeos.push({value: key5, label:geos[key5].lat + " " +geos[key5].lat});
    }
    this.choicesGeos.setChoices(arrayGeos,'value','label', true);
};

Controller.prototype.selectionCreate = function (geoInfo) {
    console.log(geoInfo);
    var selectFloat = document.getElementById("selectFloat");
    selectFloat.style.display = "block";


    var selectFloatForm = document.getElementById("selectFloatForm");

    var h31 = document.createElement("h3");
    h31.innerText = "GEO";
    selectFloatForm.appendChild(h31);

    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.name = "geo";
    checkbox1.value = geoInfo;
    selectFloatForm.appendChild(checkbox1);

    var text1 = document.createTextNode(geos[geoInfo].lat + " " + geos[geoInfo].lng);
    selectFloatForm.appendChild(text1);

    var h32 = document.createElement("h3");
    h32.innerText = "IP";
    selectFloatForm.appendChild(h32);

    for (var i =0; i < geos[geoInfo].arrayIps.length; i++) {
        var checkbox2 = document.createElement("input");
        checkbox2.type = "checkbox";
        checkbox2.name = "ip";
        checkbox2.value = geos[geoInfo].arrayIps[i].ip;
        selectFloatForm.appendChild(checkbox2);
        var text2 = document.createTextNode(geos[geoInfo].arrayIps[i].name + " " + geos[geoInfo].arrayIps[i].ip);
        selectFloatForm.appendChild(text2);
        var newLine = document.createElement("br");
        selectFloatForm.appendChild(newLine);
    }

    var line = document.createElement("hr");
    selectFloatForm.appendChild(line);
};

Controller.prototype.selectionClose = function () {
    //remove all old childs of div
    var selectFloatForm = document.getElementById("selectFloatForm");
    while (selectFloatForm.firstChild) {
        selectFloatForm.removeChild(selectFloatForm.firstChild);
    }
    //dont display the parent div
    var selectFloat = document.getElementById("selectFloat");
    selectFloat.style.display = "none";
};

Controller.prototype.selection = function () {
    //go through all checkboxes
    this.removeAll(true);

    var ipCheckBoxes = document.getElementsByName("ip");
    var geoCheckBoxes =  document.getElementsByName("geo");
    for (var i=0; i < ipCheckBoxes.length; i++) {
        if (ipCheckBoxes[i].checked) {
            this.choicesIps.setValueByChoice(ipCheckBoxes[i].value);
        }
    }
    for (var j=0; j < geoCheckBoxes.length;j++) {
        if (geoCheckBoxes[j].checked) {
            this.choicesGeos.setValueByChoice(geoCheckBoxes[j].value)
        }
    }


    this.selectionClose();
};