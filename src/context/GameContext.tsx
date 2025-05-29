import { createContext, useContext, useState, ReactNode } from "react";

type TableDataItem = {
    forskel: string;
    min: number;
    max: number;
    uventetGevinst: number;
    uventetFradrag: number;
    ventetGevinst: number;
    ventetFradrag: number;
};

const tableData: TableDataItem[] = [
    {
        forskel: "0",
        min: 0,
        max: 0,
        uventetGevinst: 7,
        uventetFradrag: 5,
        ventetGevinst: 7,
        ventetFradrag: 5,
    },
    {
        forskel: "1-24",
        min: 1,
        max: 24,
        uventetGevinst: 7,
        uventetFradrag: 5,
        ventetGevinst: 7,
        ventetFradrag: 5,
    },
    {
        forskel: "25-49",
        min: 25,
        max: 49,
        uventetGevinst: 12,
        uventetFradrag: 10,
        ventetGevinst: 6,
        ventetFradrag: 4,
    },
    {
        forskel: "50-74",
        min: 50,
        max: 74,
        uventetGevinst: 16,
        uventetFradrag: 14,
        ventetGevinst: 5,
        ventetFradrag: 3,
    },
    {
        forskel: "75-99",
        min: 75,
        max: 99,
        uventetGevinst: 19,
        uventetFradrag: 17,
        ventetGevinst: 4,
        ventetFradrag: 3,
    },
    {
        forskel: "100-199",
        min: 100,
        max: 199,
        uventetGevinst: 22,
        uventetFradrag: 20,
        ventetGevinst: 3,
        ventetFradrag: 3,
    },
    {
        forskel: "200-299",
        min: 200,
        max: 299,
        uventetGevinst: 22,
        uventetFradrag: 18,
        ventetGevinst: 2,
        ventetFradrag: 2,
    },
    {
        forskel: "300",
        min: 300,
        max: 10000,
        uventetGevinst: 22,
        uventetFradrag: 15,
        ventetGevinst: 1,
        ventetFradrag: 2,
    },
];

type GameResult = {
    id: number;
    opponentRanking: string;
    option: string;
    result: string;
};

type GameContextType = {
    myRanking: string;
    setMyRanking: (value: string) => void;
    gameResults: GameResult[];
    addGameResult: () => void;
    removeGameResult: (id: number) => void;
    updateGameResult: (
        id: number,
        field: keyof Omit<GameResult, "id">,
        value: string
    ) => void;
    getResultValue: (params: {
        option: string;
        myRankingValue: string;
        opponentRankingValue: string;
    }) => string;
    totalResult: number;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [myRanking, setMyRanking] = useState("");
    const [gameResults, setGameResults] = useState<GameResult[]>([
        { id: 1, opponentRanking: "", option: "", result: "0" },
    ]);

    const addGameResult = () => {
        setGameResults((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                opponentRanking: "",
                option: "",
                result: "0",
            },
        ]);
    };

    const removeGameResult = (id: number) => {
        setGameResults((prev) => prev.filter((game) => game.id !== id));
    };

    const updateGameResult = (
        id: number,
        field: keyof Omit<GameResult, "id">,
        value: string
    ) => {
        setGameResults((prev) => {
            const updatedGames = prev.map((game) => {
                if (game.id === id) {
                    const updatedGame = { ...game, [field]: value };
                    if (field === "opponentRanking" || field === "option") {
                        const newOpponentRanking =
                            field === "opponentRanking"
                                ? value
                                : game.opponentRanking;
                        const newOption =
                            field === "option" ? value : game.option;

                        // Only calculate result if both inputs are valid
                        if (newOpponentRanking && newOption && myRanking) {
                            updatedGame.result = getResultValue({
                                option: newOption,
                                myRankingValue: myRanking,
                                opponentRankingValue: newOpponentRanking,
                            });
                        } else {
                            updatedGame.result = "0";
                        }
                    }
                    return updatedGame;
                }
                return game;
            });
            return updatedGames;
        });
    };

    const getResultValue = ({
        option,
        myRankingValue,
        opponentRankingValue,
    }: {
        option: string;
        myRankingValue: string;
        opponentRankingValue: string;
    }) => {
        if (
            myRankingValue === "" ||
            opponentRankingValue === "" ||
            option === ""
        )
            return "0";

        const difference = Math.abs(
            Number(myRankingValue) - Number(opponentRankingValue)
        );
        const res = tableData.find(
            (item) => item.min <= difference && difference <= item.max
        );

        const condition = +myRankingValue < +opponentRankingValue;
        const resultMap = {
            "1": condition ? res?.uventetGevinst : res?.ventetGevinst,
            "0": condition ? res?.ventetFradrag : res?.uventetFradrag,
        };

        const result = resultMap[option as "0" | "1"] ?? 0;
        return result === 0
            ? `${result}`
            : `${option === "1" ? "+" : "-"}${result}`;
    };

    const totalResult = gameResults.reduce((sum, game) => {
        const result = parseInt(game.result) || 0;
        return sum + result;
    }, 0);

    return (
        <GameContext.Provider
            value={{
                myRanking,
                setMyRanking,
                gameResults,
                addGameResult,
                removeGameResult,
                updateGameResult,
                getResultValue,
                totalResult,
            }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
