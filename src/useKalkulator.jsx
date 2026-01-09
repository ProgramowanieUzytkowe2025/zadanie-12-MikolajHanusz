import { useState, useReducer, useEffect } from 'react';

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
    case actionTypes.PRZYWRÓĆ:
      return 'Przywrócono historyczny stan';
    default:
      return 'Brak';
  }
};

export const useKalkulator = () => {
  const [wynik, setWynik] = useState(0);
  const [historia, setHistoria] = useState([]);
  const [liczbaA, setLiczbaA] = useState(0);
  const [liczbaB, setLiczbaB] = useState(0);
  const [komunikat, dispatchKomunikat] = useReducer(komunikatReducer, 'Brak');

  const zapiszStan = () => {
    const stan = {
      wynik,
      historia,
      liczbaA,
      liczbaB,
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

  const dodaj = () => {
    const nowyWynik = liczbaA + liczbaB;
    setWynik(nowyWynik);
    zaktualizujHistorie(`${liczbaA} + ${liczbaB} = ${nowyWynik}`);
    dispatchKomunikat({ type: actionTypes.OBLICZENIE });
    zapiszStan();
  };

  const odejmij = () => {
    const nowyWynik = liczbaA - liczbaB;
    setWynik(nowyWynik);
    zaktualizujHistorie(`${liczbaA} - ${liczbaB} = ${nowyWynik}`);
    dispatchKomunikat({ type: actionTypes.OBLICZENIE });
    zapiszStan();
  };

  const pomnoz = () => {
    const nowyWynik = liczbaA * liczbaB;
    setWynik(nowyWynik);
    zaktualizujHistorie(`${liczbaA} * ${liczbaB} = ${nowyWynik}`);
    dispatchKomunikat({ type: actionTypes.OBLICZENIE });
    zapiszStan();
  };

  const podziel = () => {
    if (liczbaB === 0) {
      alert('Nie można dzielić przez zero!');
      return;
    }
    const nowyWynik = liczbaA / liczbaB;
    setWynik(nowyWynik);
    zaktualizujHistorie(`${liczbaA} / ${liczbaB} = ${nowyWynik}`);
    dispatchKomunikat({ type: actionTypes.OBLICZENIE });
    zapiszStan();
  };

  const zaktualizujHistorie = (operacja) => {
    setHistoria((prevHistoria) => [...prevHistoria, operacja]);
  };

  const przywrocHistorie = () => {
    const ostatniaOperacja = historia[historia.length - 1];
    if (ostatniaOperacja) {
      dispatchKomunikat({ type: actionTypes.PRZYWRÓĆ });
    }
  };

  const zmienLiczbeA = (wartosc) => {
    setLiczbaA(wartosc);
    dispatchKomunikat({ type: actionTypes.SET_A });
    zapiszStan();
  };

  const zmienLiczbeB = (wartosc) => {
    setLiczbaB(wartosc);
    dispatchKomunikat({ type: actionTypes.SET_B });
    zapiszStan();
  };

  return {
    wynik,
    historia,
    komunikat,
    dodaj,
    odejmij,
    pomnoz,
    podziel,
    zmienLiczbeA,
    zmienLiczbeB,
    przywrocHistorie,
  };
};
