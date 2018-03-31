var tracesCount = 0;
var realPoints;
var points;
function readData(url,color,text) {
    var coord = [];
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
            //same data
            if (last >= 0){
                if (row.data[0][4] == coord[last].lat || row.data[0][5] == coord[last].lng) {
                    //console.log("duplicity value");
                    points++;
                    return;
                }
            }
            var point = {lat: Number(row.data[0][4]), lng: Number(row.data[0][5])};
            coord.push(point);
            last++;
            realPoints++;
            points++;
        },
        complete: function () {
            console.log("trace finished: "+ last);
            //console.log(coord);
            //console.log("wau");
            main.lineGenerator.generateLines(coord,color);
        }
    });
}

function loadData() {
    //Argentina
    tracesCount = tracesCount+20;
    for (var i =1; i<=20;i++) {
        readData("data/Argentina/Argentina" + i + ".csv",0xff0000,"Argentina");
    }
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
    /*//Chile
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