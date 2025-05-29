import { KeyboardEvent, useRef, useState } from "react";
import { CiFaceSmile } from "react-icons/ci";
import { PiSmileySad } from "react-icons/pi";
import { useGame } from "../context/GameContext";

type GameResultSectionProps = {
    gameId: number;
    index: number;
    opponentRanking: string;
    option: string;
    result: string;
};

const GameResultSection = ({
    gameId,
    index,
    opponentRanking,
    option,
    result,
}: GameResultSectionProps) => {
    const { updateGameResult, removeGameResult } = useGame();
    const labelWinRef = useRef<HTMLLabelElement>(null);
    const [error, setError] = useState("");

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

    const handleOpponentRankingChange = (value: string) => {
        const error = validateInput(value);
        setError(error);
        if (!error) {
            updateGameResult(gameId, "opponentRanking", value);
        }
    };

    const handleOptionChange = (value: string) => {
        updateGameResult(gameId, "option", value);
    };

    const keyDownHandler = (event: KeyboardEvent<HTMLLabelElement>) => {
        const { code } = event;
        const { htmlFor } = event.target as HTMLLabelElement;

        if (htmlFor === "vundet" && code === "ArrowUp") {
            const myRankingInput = document.querySelector(
                'input[name="myRanking"]'
            );
            if (myRankingInput) {
                (myRankingInput as HTMLInputElement).focus();
            }
        }

        if (code === "ArrowDown" || code === "ArrowRight") {
            (
                (event.target as HTMLLabelElement)
                    .nextElementSibling as HTMLElement
            )?.focus?.();
        }

        if (code === "ArrowLeft" || code === "ArrowUp") {
            (
                (event.target as HTMLLabelElement)
                    .previousElementSibling as HTMLElement
            )?.focus?.();
        }
    };

    return (
        <div className="flex flex-wrap gap-4 max-w-xs relative shadow-md shadow-amber-400 p-2 rounded-lg">
            <button
                onClick={() => removeGameResult(gameId)}
                className="absolute top-2 right-4 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Fjern kamp">
                ×
            </button>
            <label className="grid gap-4 relative pb-8">
                <span>Skriv modstanderens ranking: </span>
                <input
                    type="tel"
                    inputMode="numeric"
                    name="opponentRanking"
                    className="outline outline-blue-500 focus:outline-blue-700 px-2 py-1 rounded"
                    value={opponentRanking}
                    onChange={(e) =>
                        handleOpponentRankingChange(e.target.value)
                    }
                />
                {error && (
                    <span className="absolute -bottom-4 left-2 text-red-500 text-sm">
                        {error}
                    </span>
                )}
            </label>
            <fieldset className="p-4 border border-gray-300 rounded-lg">
                <legend className="pb-4 text-lg font-semibold text-gray-700">
                    Har du vundet eller tabt kampen?
                </legend>
                <div className="flex flex-col gap-3">
                    <label
                        ref={index === 0 ? labelWinRef : undefined}
                        onKeyDown={keyDownHandler}
                        htmlFor={`vundet-${gameId}`}
                        tabIndex={0}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
                        border-gray-300 hover:border-green-500 peer-checked:border-green-500 peer-checked:bg-blue-100">
                        <input
                            id={`vundet-${gameId}`}
                            type="radio"
                            name={`option-${gameId}`}
                            value="1"
                            checked={option === "1"}
                            onChange={(e) => handleOptionChange(e.target.value)}
                            className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-green-500 peer-checked:bg-green-500 transition-all">
                            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <CiFaceSmile className="text-2xl text-green-500" />
                        <span className="text-gray-700">
                            Ja, jeg har vundet kampen
                        </span>
                    </label>
                    <label
                        onKeyDown={keyDownHandler}
                        htmlFor={`tabt-${gameId}`}
                        tabIndex={0}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all 
                        border-gray-300 hover:border-red-500 peer-checked:border-red-500 peer-checked:bg-red-100">
                        <input
                            type="radio"
                            name={`option-${gameId}`}
                            value="0"
                            id={`tabt-${gameId}`}
                            checked={option === "0"}
                            onChange={(e) => handleOptionChange(e.target.value)}
                            className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition-all">
                            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <PiSmileySad className="text-2xl text-red-500" />
                        <span className="text-gray-700">
                            Nej, jeg har tabt kampen
                        </span>
                    </label>
                </div>
            </fieldset>
            <div className="flex gap-2 w-full">
                Resultat:
                <span
                    className={
                        +result > 0
                            ? "text-green-500"
                            : +result < 0
                            ? "text-red-500"
                            : "text-black"
                    }>
                    {result} points
                </span>
            </div>
        </div>
    );
};

export default GameResultSection;
