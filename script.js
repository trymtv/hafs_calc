function beregn() {
    const varmekilde = document.getElementById('varmekilde').value;
    const volumstrom = parseFloat(document.getElementById('volumstrom').value);
    const temperatur = parseFloat(document.getElementById('temperatur').value);
    const temperaturRetur = parseFloat(document.getElementById('temperaturRetur').value);
    const varmebehov = parseFloat(document.getElementById('varmebehov').value);
    const tempTilOppvarming = parseFloat(document.getElementById('tempTilOppvarming').value);
    const cop = parseFloat(document.getElementById('cop').value);
    const arsforbrukOppvarming = parseFloat(document.getElementById('arsforbrukOppvarming').value);

    const varmevekslserTemp = temperatur - 3;

    function DeltaTemp(temperaturRetur) {
        if (temperaturRetur === 0) {
            return varmevekslserTemp - 15;
        } else {
            return varmevekslserTemp - temperaturRetur;
        }
    }

    const Cp = 4.18;

    function uthentetEffekt(deltaTemp, Cp, volumstrom) {
        return Cp * deltaTemp * volumstrom;
    }

    const deltaTemp = DeltaTemp(temperaturRetur);
    const effekt = uthentetEffekt(deltaTemp, Cp, volumstrom);

    function varmpepumpe(cop, varmebehov, tempTilOppvarming) {
        let rorTemp = tempTilOppvarming === 0 ? 55 : tempTilOppvarming;
        if( cop == 0){
            COP1 = 4; 
        }
        //let COP1 = cop === 0 ? 4 : cop;
        //let COP2 = cop === 0 ? (rorTemp + 273) / (rorTemp - varmevekslserTemp) : cop;
        
        COP2 = (rorTemp + 273) / (rorTemp - varmevekslserTemp);
        let levertEffekt = varmebehov / 2;
        let effektTilfortCOP1 = levertEffekt / COP1;
        let effektTilfortCOP2 = levertEffekt / COP2;

        return { effektTilfortCOP1, effektTilfortCOP2, COP2 };
    }

    const { effektTilfortCOP1, effektTilfortCOP2, COP2 } = varmpepumpe(cop, varmebehov, tempTilOppvarming);

    const timerÅrOppvarming = 5808;
    const CO2ekvivalent = 0.019;
    const timerIEttÅr = 8765;

    const årsforbrukVarmepumpeMax = timerÅrOppvarming * effektTilfortCOP2;
    const årsforbrukVarmepumpeMin = timerÅrOppvarming * effektTilfortCOP1;

    function spartCO2() {
        const spartEffektMax = arsforbrukOppvarming - årsforbrukVarmepumpeMax;
        const spartEffektMin = arsforbrukOppvarming - årsforbrukVarmepumpeMin;

        const spartCO2max = spartEffektMax * CO2ekvivalent;
        const spartCO2min = spartEffektMin * CO2ekvivalent;

        return { spartCO2min, spartCO2max };
    }

    const { spartCO2min, spartCO2max } = spartCO2();

    function antallBoliger(){
        const effektÅr = timerIEttÅr * effekt;
        const Boliger = effektÅr/15000;
        return {Boliger}
    }

    const { Boliger } = antallBoliger();

    document.getElementById('resultat').innerHTML = `
        <h1>Resultat</h1>
        <p>Du kan hente ut ${effekt.toFixed(0)} kW fra ${varmekilde}</p>
        <p>Den høyeste teoretiske COPen med ønsket temperatur er: ${COP2.toFixed(2)}</p>
        <p>Med en realistisk COP på 4 kan du få en varmepumpe som bruker ${effektTilfortCOP1.toFixed(0)} kW. Den teoretisk mest effektive varmepumpen vil bruke ca. ${effektTilfortCOP2.toFixed(0)} kW</p>
        <p>Maksimal teoretisk COP gjør at du sparer ${(arsforbrukOppvarming - årsforbrukVarmepumpeMax).toFixed(0)} kWh per år og da ca. ${spartCO2max.toFixed(0)} kg CO2e per år. Med den valgte COPen vil du kunne spare ${arsforbrukOppvarming - årsforbrukVarmepumpeMin.toFixed(0)} kWh per år og ca. ${spartCO2min.toFixed(0)} kg CO2e per år</p>
        <p>Dette tilsvarer energien som brukes til å varme opp ${Boliger.toFixed(0)} boliger elektrisk </p>`;
}


//mørkeblå 0b4350
//lyseblå d6e8e1
