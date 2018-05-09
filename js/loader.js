var tracesCount = 0;
var tracesCounter = 0;
var realPoints;
var points;
function readData(url,text) {
    var newPath = {name: text,
        addresses: []};
    //same name path exists, add random number to the end of the name
    if (text in paths === true) {
        text += Math.random().toString(36).substring(7);
    }
    paths[text] = newPath;
    var last = -1;
    Papa.parse(url, {
        download: true,
        step: function (row) {
            //wrong data
            if (isNaN(row.data[0][4]) || isNaN(row.data[0][5])) {
                //console.log("not a number" + row.data[0][4] + " " + row.data[0][5]);
                return;
            }
            //missing data
            if (row.data[0][4] === '*' || row.data[0][5] === '*' ||
                row.data[0][4] == 0 || row.data[0][5] == 0 ||
                row.data[0][4] == '' || row.data[0][5] == '') {
                //console.log("wrong number " + row.data[0][4] + " " + row.data[0][5]);
                return;
            }
            //same data testing, something must be last
            if (last >= 0){
                if (row.data[0][4] == newPath.addresses[last].lat || row.data[0][5] == newPath.addresses[last].lng) {
                    //console.log("duplicity value");
                    points++;
                    return;
                }
            }

            var newAddress = {};
            newAddress.seq = row.data[0][0];
            newAddress.name = row.data[0][1];
            newAddress.ip = row.data[0][2];
            newAddress.time = row.data[0][3];
            newAddress.lat = row.data[0][4];
            newAddress.lng = row.data[0][5];
            //todo add from path
            //push information to new forming path
            newPath.addresses.push(newAddress);
            //push pointer to hashTable
            if (newAddress.ip in addresses === false) {
                addresses[newAddress.ip] = [];
            }
            addresses[newAddress.ip].push(newPath);
            //push pointer to GEO hashtable
            if (newAddress.lat+newAddress.lng in geos === false) {
                geos[newAddress.lat+newAddress.lng] = {array: [], lat: newAddress.lat, lng: newAddress.lng, arrayIps: []};
            }
            geos[newAddress.lat+newAddress.lng].array.push(newPath);
            geos[newAddress.lat+newAddress.lng].arrayIps.push(newAddress);

            last++;
            realPoints++;
            points++;
        },
        complete: function () {
            console.log("path loaded: "+ last);
            tracesCounter++;
            //console.log(newPath.addresses);
            //console.log("wau");
            //main.lineGenerator.generateLines(newPath,0xff0000, false, false);
            if (tracesCounter == tracesCount) {
                console.log("fill the selectors");
                main.controller.loadChoices();
            }
        }
    });
}


function loadDataFromBrowser() {
    //todo maybe??
}

function loadDataFromServer() {
    //Argentina
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Argentina/Argentina" + i + ".csv","Argentina"+ i + ".csv");
    }

    //Arizona
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/ArizonaC/Arizona" + i + ".csv","Arizona"+ i + ".csv");
    }
    //Australia
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Australia/Australia" + i + ".csv","Australia"+ i + ".csv");
    }
    //Belgium
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Belgium/Belgium" + i + ".csv","Belgium"+ i + ".csv");
    }
    //Brazil
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Brazil/Brazil_fix" + i + ".csv","Brazil"+ i + ".csv");
    }
    //California
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/CaliforniaC/California" + i + ".csv","California"+ i + ".csv");
    }
    //Canada
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/CanadaE/CanadaE" + i + ".csv","Canada"+ i + ".csv");
    }
    //Chile
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Chile/Chile" + i + ".csv","Chile"+ i + ".csv");
    }
    //Germany
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Germany/Germany" + i + ".csv","Germany"+ i + ".csv");
    }
    //India
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/India/India" + i + ".csv","India"+ i + ".csv");
    }
    //Indonesia
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Indonesia/Indonesia" + i + ".csv","Indonesia"+ i + ".csv");
    }
    //Italy
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Italy/Italy" + i + ".csv","Italy"+ i + ".csv");
    }
    //Netherlands
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Netherlands/Netherlands" + i + ".csv","Netherlands"+ i + ".csv");
    }
    //NewYork
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/NewYorkC/NewYork" + i + ".csv","NewYork"+ i + ".csv");
    }
    //Pakistan
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Pakistan/Pakistan" + i + ".csv","Pakistan"+ i + ".csv");
    }
    //Poland
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Poland/Poland" + i + ".csv","Poland"+ i + ".csv");
    }
    //SouthAfrica
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/SouthAfrica/SouthAfrica" + i + ".csv","SouthAfrica"+ i + ".csv");
    }
    //Sweden
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Sweden/Sweden" + i + ".csv","Sweden"+ i + ".csv");
    }
    //Thailand
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Thailand/Thailand" + i + ".csv","Thailand"+ i + ".csv");
    }
    //UnitedKingdom
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/UnitedKingdom/UnitedKingdom" + i + ".csv","UnitedKingdom"+ i + ".csv");
    }
}