var tracesCount = 0;
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
            //push information to new forming path
            newPath.addresses.push(newAddress);
            //push pointer to hashTable
            if (newAddress.ip in addresses === false) {
                addresses[newAddress.ip] = [];
            }
            addresses[newAddress.ip].push(newPath);
            //push pointer to GEO hashtable
            if (newAddress.lat+newAddress.lng in geos === false) {
                geos[newAddress.lat+newAddress.lng] = [];
            }
            geos[newAddress.lat+newAddress.lng] = newPath;

            last++;
            realPoints++;
            points++;
        },
        complete: function () {
            console.log("path loaded: "+ last);
            console.log(newPath.addresses);
            //console.log("wau");
            main.lineGenerator.generateLines(newPath,0xff0000, false, false);
        }
    });
}


function loadDataFromBrowser() {
    //todo maybe??
}

function loadDataFromServer() {
    //Argentina
    tracesCount = tracesCount+20;
    for (var i =1; i<=1;i++) {
        readData("data/Argentina/Argentina" + i + ".csv","Argentina"+ i + ".csv");
    }
    /*
    //Arizona
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/ArizonaC/Arizona" + i + ".csv",0xffff00,"Arizona");
    }
    //Australia
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Australia/Australia" + i + ".csv",0xffffff,"Australia");
    }
    //Belgium
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Belgium/Belgium" + i + ".csv",0x00ff00,"Belgium");
    }
    //Brazil
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Brazil/Brazil_fix" + i + ".csv",0x00ffff,"Brazil");
    }
    //California
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/CaliforniaC/California" + i + ".csv",0x0000ff,"California");
    }
    //Canada
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/CanadaE/CanadaE" + i + ".csv",0x000000,"Canada");
    }
    //Chile
    color = document.getElementById('ChileColor').value;
    markerEnable = document.getElementById('ChileMarker').checked;
    countryEnable = document.getElementById('Chile').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Chile/Chile" + i + ".csv",color,markerEnable,"Chile");
        }
    }
    //Germany
    color = document.getElementById('GermanyColor').value;
    markerEnable = document.getElementById('GermanyMarker').checked;
    countryEnable = document.getElementById('Germany').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Germany/Germany" + i + ".csv",color,markerEnable,"Germany");
        }
    }
    //India
    color = document.getElementById('IndiaColor').value;
    markerEnable = document.getElementById('IndiaMarker').checked;
    countryEnable = document.getElementById('India').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/India/India" + i + ".csv",color,markerEnable,"India");
        }
    }
    //Indonesia
    color = document.getElementById('IndonesiaColor').value;
    markerEnable = document.getElementById('IndonesiaMarker').checked;
    countryEnable = document.getElementById('Indonesia').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Indonesia/Indonesia" + i + ".csv",color,markerEnable,"Indonesia");
        }
    }
    //Italy
    color = document.getElementById('ItalyColor').value;
    markerEnable = document.getElementById('ItalyMarker').checked;
    countryEnable = document.getElementById('Italy').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Italy/Italy" + i + ".csv",color,markerEnable,"Italy");
        }
    }
    //Netherlands
    color = document.getElementById('NetherlandsColor').value;
    markerEnable = document.getElementById('NetherlandsMarker').checked;
    countryEnable = document.getElementById('Netherlands').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Netherlands/Netherlands" + i + ".csv",color,markerEnable,"Netherlands");
        }
    }
    //NewYork
    color = document.getElementById('NewYorkColor').value;
    markerEnable = document.getElementById('NewYorkMarker').checked;
    countryEnable = document.getElementById('NewYork').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/NewYorkC/NewYork" + i + ".csv",color,markerEnable,"NewYork");
        }
    }
    //Pakistan
    color = document.getElementById('PakistanColor').value;
    markerEnable = document.getElementById('PakistanMarker').checked;
    countryEnable = document.getElementById('Pakistan').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Pakistan/Pakistan" + i + ".csv",color,markerEnable,"Pakistan");
        }
    }
    //Poland
    color = document.getElementById('PolandColor').value;
    markerEnable = document.getElementById('PolandMarker').checked;
    countryEnable = document.getElementById('Poland').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Poland/Poland" + i + ".csv",color,markerEnable,"Poland");
        }
    }
    //SouthAfrica
    color = document.getElementById('SouthAfricaColor').value;
    markerEnable = document.getElementById('SouthAfricaMarker').checked;
    countryEnable = document.getElementById('SouthAfrica').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/SouthAfrica/SouthAfrica" + i + ".csv",color,markerEnable,"South Africa");
        }
    }
    //Sweden
    color = document.getElementById('SwedenColor').value;
    markerEnable = document.getElementById('SwedenMarker').checked;
    countryEnable = document.getElementById('Sweden').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Sweden/Sweden" + i + ".csv",color,markerEnable,"Sweden");
        }
    }
    //Thailand
    color = document.getElementById('ThailandColor').value;
    markerEnable = document.getElementById('ThailandMarker').checked;
    countryEnable = document.getElementById('Thailand').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/Thailand/Thailand" + i + ".csv",color,markerEnable,"Thailand");
        }
    }
    //UnitedKingdom
    color = document.getElementById('UnitedKingdomColor').value;
    markerEnable = document.getElementById('UnitedKingdomMarker').checked;
    countryEnable = document.getElementById('UnitedKingdom').checked;
    if (countryEnable) {
        tracesCount = tracesCount+20;
        for (var i =1; i<=20;i++) {
            readData("../data/UnitedKingdom/UnitedKingdom" + i + ".csv",color,markerEnable,"United Kingdom");
        }
    }*/
}