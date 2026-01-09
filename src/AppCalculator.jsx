import './AppCalculator.css';
import { useState, useEffect, useReducer } from 'react';
import { AppButton } from './AppButton';
import { AppCalculationHistory } from './AppCalculationHistory';
import { useFont } from './FontContext';
import { useKalkulator } from './useKalkulator';

export function AppCalculator() {
    const { czcionka } = useFont();
    const [liczbaA, setLiczbaA] = useState(null);
    const [liczbaB, setLiczbaB] = useState(null);
    const [wynik, setWynik] = useState(null);
    const [historia, setHistoria] = useState([]);
    const [comparison, setPorownanie] = useState('');

    const zapiszStan = () => {
        const stan = {
        wynik,
        historia,
        liczbaA,
        liczbaB,
        komunikat,
        };
        sessionStorage.setItem('kalkulatorStan', JSON.stringify(stan));
    };

    const odczytajStan = () => {
        const zapisanyStan = sessionStorage.getItem('kalkulatorStan');
        if (zapisanyStan) {
        const stan = JSON.parse(zapisanyStan);
        setWynik(stan.wynik);
        setHistoria(stan.historia);
        setLiczbaA(stan.liczbaA);
        setLiczbaB(stan.liczbaB);
        }
    };

    useEffect(() => {
    odczytajStan();
    }, []);

    const actionTypes = {
        SET_A: 'SET_A',
        SET_B: 'SET_B',
        OBLICZENIE: 'OBLICZENIE',
        PRZYWRÓĆ: 'PRZYWRÓĆ',
    };

    const komunikatReducer = (state, action) => {
    switch (action.type) {
    case actionTypes.SET_A:
      return 'Zmodyfikowano wartość liczby A';
    case actionTypes.SET_B:
      return 'Zmodyfikowano wartość liczby B';
    case actionTypes.OBLICZENIE:
      return 'Wykonano obliczenia';
    case actionTypes.PRZYWROC:
      return 'Przywrócono historyczny stan';
    default:
      return 'Brak';
    }
    };

    const [komunikat, dispatchKomunikat] = useReducer(komunikatReducer, 'Brak');
     
    const updatePorownanie = () => {
        if (liczbaA && liczbaB) {
            if (parseFloat(liczbaA) > parseFloat(liczbaB)) {
                setPorownanie('Liczba A jest większa od liczby B');
            } else if (parseFloat(liczbaA) < parseFloat(liczbaB)) {
                setPorownanie('Liczba A jest mniejsza od liczby B');
            } else {
                setPorownanie('Liczba A jest równa liczbie B');
            }
        }
    };

    useEffect(() => {
        updatePorownanie();
    }, [liczbaA, liczbaB]);


    function dodaj() {
        aktualizujHistorie('+', liczbaA + liczbaB);
    }

    function odejmij() {
        aktualizujHistorie('-', liczbaA - liczbaB);
    }

    function pomnoz() {
        aktualizujHistorie('*', liczbaA * liczbaB);
    }

    function podziel() {
        if(liczbaB !== 0) {
            aktualizujHistorie('/', liczbaA / liczbaB);
        }
    }

    function liczbaAOnChange(value) {
        setLiczbaA(parsujLiczbe(value));
        dispatchKomunikat({ type: actionTypes.SET_A });
        zapiszStan();
        console.log(sessionStorage)
    }

    function parsujLiczbe(value) {
        const sparsowanaLiczba = parseFloat(value);
        if(isNaN(sparsowanaLiczba)) {
            return null;
        } else {
            return sparsowanaLiczba;
        } 
    }

    function liczbaBOnChange(value) {
        setLiczbaB(parsujLiczbe(value));
        dispatchKomunikat({ type: actionTypes.SET_B });
        zapiszStan();
    }

    function onAppCalculationHistoryClick(index) {
        const nowaHistoria = historia.slice(0, index + 1);
        setHistoria(nowaHistoria);
        setLiczbaA(historia[index].a);
        setLiczbaB(historia[index].b);
        setWynik(historia[index].wynik);
        dispatchKomunikat({ type: actionTypes.PRZYWROC });
    }

    function aktualizujHistorie(operation, wynik) {
        dispatchKomunikat({ type: actionTypes.OBLICZENIE });
        const nowaHistoria = [...historia, { a: liczbaA, b: liczbaB, operation: operation, wynik: wynik }];
        setHistoria(nowaHistoria);
        setWynik(wynik);
        zapiszStan();
    }

    let zablokujPrzyciski = liczbaA == null || liczbaB == null;
    let zablokujDzielenie = zablokujPrzyciski || liczbaB === 0;

    return (
    <div className='app-calculator' style={{ fontSize: czcionka }}>
        <div className='app-calculator-pole'>
            <label>Wynik: </label>
            <span>{wynik}</span>
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label>Dynamiczne porównanie liczb: </label>
            <input type="text" value={comparison} style={{ width: '300px' }} readOnly />
        </div>
        <div className='app-calculator-pole'>
            <label>Ostatnia wykonana czynność</label>
            <input type="text" value={komunikat} style={{ width: '300px' }} readOnly />
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label htmlFor="liczba1">Liczba A</label>
            <input id="liczba1" type="number" value={liczbaA} onChange={(e) => liczbaAOnChange(e.target.value)} name="liczba1" />
        </div>
        <div className='app-calculator-pole'>
            <label htmlFor="liczba2">Liczba B</label>
            <input id="liczba2" type="number" value={liczbaB} onChange={(e) => liczbaBOnChange(e.target.value)} name="liczba2" />
        </div>

        <hr />

        <div className='app-calculator-przyciski'>
            <AppButton disabled={zablokujPrzyciski} title="+" onClick={() => dodaj()}/>
            <AppButton disabled={zablokujPrzyciski} title="-" onClick={() => odejmij()}/>
            <AppButton disabled={zablokujPrzyciski} title="*" onClick={() => pomnoz()}/>
            <AppButton disabled={zablokujDzielenie} title="/" onClick={() => podziel()}/>
        </div>

        <hr />
        
        <div className='app-calculator-historia'>
            <AppCalculationHistory historia={historia} onClick={(index) => onAppCalculationHistoryClick(index)}/>
        </div>
    </div>)
}