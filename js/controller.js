function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function Controller(scene) {
    this.scene = scene;
    this.choicesPaths = new Choices('#choicesPaths', {
        removeItemButton: true,
        choices: []});
    var self = this;
    this.choicesPaths.passedElement.addEventListener('addItem', function(event) {
        self.addLine(event.detail.value);
    });

    this.choicesPaths.passedElement.addEventListener('removeItem', function(event) {
        self.generateLines();
    });


    this.choicesIps = new Choices('#choicesIps', {
        removeItemButton: true,
        choices: []});
    this.choicesIps.passedElement.addEventListener('addItem', function(event) {
        //found all paths with this ip
        self.pathFromElse(event.detail.value,addresses,false);
    });

    this.choicesIps.passedElement.addEventListener('removeItem', function(event) {
        self.generateLines();
    });


    this.choicesGeos = new Choices('#choicesGeos', {
        removeItemButton: true,
        choices: []});
    this.choicesGeos.passedElement.addEventListener('addItem', function(event) {
        //found additional paths with this geo informs
        self.pathFromElse(event.detail.value,geos,true);
    });

    this.choicesGeos.passedElement.addEventListener('removeItem', function(event) {
        self.generateLines();
    });
}

Controller.prototype.pathFromElse = function (pathName,source, geos) {
    var addedPaths;
    if (geos) {
        addedPaths = source[pathName].array;
    }
    else {
        addedPaths = source[pathName];
    }
    for (var i = 0; i < addedPaths.length; i++) {
        //GROUPING enabled
        if (document.getElementById("groupingCheckBox").checked) {
            this.choicesPaths.setValueByChoice(addedPaths[i].group);
        }
        //GROUPING disabled
        else {
            this.choicesPaths.setValueByChoice(addedPaths[i].name);
        }
    }
};

Controller.prototype.addLine = function (pathName) {
    console.log(pathName);
    //add options
    //todo save to array/hash if the options are created...
    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.id = pathName;
    checkbox1.onclick = main.controller.modifyLine("pathName,false");
    var text1 = document.createTextNode('TEXT');

    var checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.id = pathName;
    checkbox2.onclick = main.controller.modifyLine("pathName,false");
    var text2 = document.createTextNode('POINT');

    var color = document.createElement("input");
    color.type = "color";
    color.onclick = main.controller.modifyLine("pathName,false");
    color.id = pathName;
    color.value = getRandomColor();

    var label = document.createElement("label");
    label.innerHTML = pathName;

    var br = document.createElement("br");

    var parentDiv = document.getElementById("pathsCorrect");
    parentDiv.appendChild(checkbox1);
    parentDiv.appendChild(text1);
    parentDiv.appendChild(checkbox2);
    parentDiv.appendChild(text2);
    parentDiv.appendChild(color);
    parentDiv.appendChild(label);
    parentDiv.appendChild(br);

    //add line to threejs
    //GROUPING enabled
    if (document.getElementById("groupingCheckBox").checked) {
        for (var key in paths) {
            if (paths[key].group === pathName) {
                main.lineGenerator.generateLines(paths[key],color.value,false,false,main.cameraZoom);
            }
        }
    }
    //GROUPING disabled
    else {
        main.lineGenerator.generateLines(paths[pathName],color.value,false,false,main.cameraZoom);
    }

};

Controller.prototype.addAll = function () {
    console.log("ADD ALL");
    //add everything from paths

    //GROUPING enabled
    if (document.getElementById("groupingCheckBox").checked) {
        var groupHashTable = {};
        for (var key1 in paths) {
            groupHashTable[paths[key1].group] = paths[key1].group;
        }
        for (var key2 in groupHashTable) {
            this.choicesPaths.setValueByChoice(key2);
        }
    }
    //GROUPING disabled
    else {
        for (var key3 in paths) {
            this.choicesPaths.setValueByChoice(key3);
        }
    }
};

Controller.prototype.removeAll = function (reloadChoices) {
    console.log("REMOVE ALL");
    if (reloadChoices) {
        this.loadChoices();
    }
    main.lineGenerator.removeAll();

    //remove div and create it again
    var element = document.getElementById("pathsCorrect");
    element.parentNode.removeChild(element);

    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.onclick = main.controller.modifyLine("",true);
    var text1 = document.createTextNode('TEXT');

    var checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.onclick = main.controller.modifyLine("",true);
    var text2 = document.createTextNode('POINT');

    var color = document.createElement("input");
    color.type = "color";
    color.onclick = main.controller.modifyLine("",true);
    color.value = getRandomColor();

    var label = document.createElement("label");
    label.innerHTML = "Enable ALL";

    var br = document.createElement("br");

    var divSelect = document.getElementById("select");

    var parentDiv = document.createElement("div");
    parentDiv.id = "pathsCorrect";
    //add created div to the select div
    divSelect.appendChild(parentDiv);
    parentDiv.appendChild(checkbox1);
    parentDiv.appendChild(text1);
    parentDiv.appendChild(checkbox2);
    parentDiv.appendChild(text2);
    parentDiv.appendChild(color);
    parentDiv.appendChild(label);
    parentDiv.appendChild(br);

};

Controller.prototype.modifyLine = function (pathName, allPaths) {

};

Controller.prototype.generateLines = function () {
    //todo after removing the line, the new color is set
    this.removeAll(false);
    //add all paths
    var pathsValues = this.choicesPaths.getValue(true);
    for (var i =0 ; i < pathsValues.length; i++) {
        this.addLine(pathsValues[i])
    }
    //add additional paths from ips
    var addressesValues = this.choicesIps.getValue(true);
    for (var j =0 ; j < addressesValues.length; j++) {
        this.pathFromElse(addressesValues[j],addresses,false);
    }
    //add additonal paths from geos
    var geosValues = this.choicesGeos.getValue(true);
    for (var k =0 ; k < geosValues.length; k++) {
        this.pathFromElse(geosValues[k],geos,true);
    }
};

Controller.prototype.loadChoices = function () {
    this.choicesPaths.clearStore();
    this.choicesIps.clearStore();
    this.choicesGeos.clearStore();
    //paths loading
    //show as groups
    var arrayPaths = [];
    if (document.getElementById("groupingCheckBox").checked){
        var groupHashTable = {};
        for (var key1 in paths) {
            groupHashTable[paths[key1].group] = paths[key1].group;
        }
        for (var key2 in groupHashTable) {
            arrayPaths.push({value: key2, label:key2});
        }
        this.choicesPaths.setChoices(arrayPaths,'value','label', true);
    }
    //show as paths
    else {
        for (var key3 in paths) {
            arrayPaths.push({value: key3, label:key3});
        }
        this.choicesPaths.setChoices(arrayPaths,'value','label', true);
    }
    console.log(arrayPaths);

    //IP loading
    var arrayIps = [];
    for (var key4 in addresses) {
        arrayIps.push({value: key4, label:key4});
    }
    console.log(arrayIps);
    this.choicesIps.setChoices(arrayIps,'value','label', true);

    //GEO loading
    var arrayGeos = [];
    for (var key5 in geos) {
        arrayGeos.push({value: key5, label:geos[key5].lat + " " +geos[key5].lat});
    }
    console.log(arrayGeos);
    this.choicesGeos.setChoices(arrayGeos,'value','label', true);
};

Controller.prototype.selectionCreate = function (geoInfo) {
    //todo check if the div is created
    console.log(geoInfo);
    var selectFloat = document.getElementById("selectFloat");
    selectFloat.style.display = "block";


    var selectFloatText = document.getElementById("selectFloatText");

    var h31 = document.createElement("h3");
    h31.innerText = "GEO";
    selectFloatText.appendChild(h31);

    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.id = geoInfo;
    selectFloatText.appendChild(checkbox1);

    var text1 = document.createTextNode(geos[geoInfo].lat + " " + geos[geoInfo].lng);
    selectFloatText.appendChild(text1);

    var h32 = document.createElement("h3");
    h32.innerText = "IP";
    selectFloatText.appendChild(h32);

    for (var i =0; i < geos[geoInfo].arrayIps.length; i++) {
        var checkbox2 = document.createElement("input");
        checkbox2.type = "checkbox";
        checkbox2.id = geos[geoInfo].arrayIps[i].ip;
        selectFloatText.appendChild(checkbox2);
        var text2 = document.createTextNode(geos[geoInfo].arrayIps[i].name + " " + geos[geoInfo].arrayIps[i].ip);
        selectFloatText.appendChild(text2);
        var newLine = document.createElement("br");
        selectFloatText.appendChild(newLine);
    }

    var line = document.createElement("hr");
    selectFloatText.appendChild(line);
};

Controller.prototype.selectionClose = function () {
    //remove all old childs of div
    var selectFloatText = document.getElementById("selectFloatText");
    while (selectFloatText.firstChild) {
        selectFloatText.removeChild(selectFloatText.firstChild);
    }
    //dont display the parent div
    var selectFloat = document.getElementById("selectFloat");
    selectFloat.style.display = "none";
};

Controller.prototype.selection = function () {
    //todo check if the div is created
    this.selectionClose();
};