import './App.css';
import { AppCalculator } from './AppCalculator';
import { AppHeader } from './AppHeader';
import { FontProvider } from './FontContext';

export default function App() {
  return (
    <FontProvider>
      <div className="app">
        <AppHeader imie={'Mikołaj'} nazwisko={'Hanusz'} />
        <AppCalculator />
      </div>
    </FontProvider>
  );
}
