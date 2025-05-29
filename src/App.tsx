import GameForm from "./components/GameForm";
import { GameProvider } from "./context/GameContext";

function App() {
    return (
        <section className="py-4">
            <title>Rangeringsberegner hjemmeside</title>
            <meta
                name="description"
                content="Rangering beregner hjemmeside, hvor du kan beregne din rangeringsgreb after kamp du vundet eller tabte"
            />
            <h1 className="text-2xl font-bold text-center pb-4">
                Rangeringsberegner
            </h1>
            <div className="max-w-[calc(100dvw-10%)] mx-auto px-4">
                <GameProvider>
                    <GameForm />
                </GameProvider>
            </div>
        </section>
    );
}

export default App;
