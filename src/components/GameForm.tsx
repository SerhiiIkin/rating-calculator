import { ChangeEvent, useRef } from "react";
import { useGame } from "../context/GameContext";
import GameResultSection from "./GameResultSection";
import { FaPlus } from "react-icons/fa6";

const GameForm = () => {
    const { myRanking, setMyRanking, gameResults, addGameResult, totalResult } =
        useGame();

    const myRankingRef = useRef<HTMLInputElement>(null);

    const validateInput = (value: string) => {
        const regExp = /[^0-9]/g;
        let error = "";

        if (regExp.test(value)) {
            error = "Indtast venligst et nummer";
        }
        if (+value >= 10000) {
            error = "Du må ikke taste et tal over 10000";
        }

        return error;
    };

    const handleMyRankingChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const error = validateInput(value);
        if (!error) {
            setMyRanking(value);
        }
    };

    return (
        <div className="">
            <label className="grid gap-4 relative pb-6">
                <span>Skriv din ranking: </span>
                <input
                    ref={myRankingRef}
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    name="myRanking"
                    className="outline outline-blue-500 focus:outline-blue-700 focus:outline-2 px-2 py-1 rounded"
                    value={myRanking}
                    onChange={handleMyRankingChange}
                />
            </label>
            <div className="flex flex-wrap gap-10">
                {gameResults.map((game, index) => (
                    <GameResultSection
                        key={game.id}
                        gameId={game.id}
                        index={index}
                        opponentRanking={game.opponentRanking}
                        option={game.option}
                        result={game.result}
                    />
                ))}
                <button
                    onClick={addGameResult}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors self-center  text-5xl cursor-pointer grid place-items-center">
                    <FaPlus />
                </button>
            </div>

            {gameResults.length > 1 && (
                <div className="flex gap-2 w-full mt-4">
                    Total resultat:
                    <span
                        className={
                            totalResult > 0
                                ? "text-green-500"
                                : totalResult < 0
                                ? "text-red-500"
                                : "text-black"
                        }>
                        {totalResult} points
                    </span>
                </div>
            )}
        </div>
    );
};

export default GameForm;
