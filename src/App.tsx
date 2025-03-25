import {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    useRef,
    useState,
} from "react";
import { CiFaceSmile } from "react-icons/ci";
import { PiSmileySad } from "react-icons/pi";

function App() {
    const myRankingRef = useRef(null);
    const opponentRankingRef = useRef(null);
    const labelWinRef = useRef(null);

    const MAX_RANKING = 10000;

    type DataField = {
        value: string;
        error: string;
    };

    type DataType = {
        [key: string]: DataField | string;
        myRanking: DataField;
        opponentRanking: DataField;
        option: string;
        result: string;
    };

    const tableData = [
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
            max: MAX_RANKING,
            uventetGevinst: 22,
            uventetFradrag: 15,
            ventetGevinst: 1,
            ventetFradrag: 2,
        },
    ];

    const [data, setData] = useState<DataType>({
        myRanking: {
            value: "",
            error: "",
        },
        opponentRanking: {
            value: "",
            error: "",
        },
        option: "",
        result: "",
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const regExp = /[^0-9]/g;

        if (name !== "myRanking" && name !== "opponentRanking") {
            return;
        }

        const errorMessage = () => {
            let error = "";
            if (regExp.test(value)) {
                error = "Indtast venligst et nummer";
            }
            if (+value >= MAX_RANKING) {
                error = `Du må ikke taste et tal over ${MAX_RANKING}`;
            }

            return error;
        };

        errorMessage();

        setData((prev) => ({
            ...prev,

            [name]: {
                value: regExp.test(value)
                    ? prev[name].value
                    : +value < MAX_RANKING
                    ? value.replace(/[^0-9]/g, "")
                    : prev[name].value,
                error: errorMessage(),
            },
        }));
    };

    const radioHandle = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
        resultHandle(value);
    };

    const resultHandle = (value: string) => {
        if (
            data.myRanking.value === "" ||
            data.opponentRanking.value === "" ||
            value === ""
        ) {
            return;
        }

        const difference = Math.abs(
            Number(data.myRanking.value) - Number(data.opponentRanking.value)
        );
        const res = tableData.find(
            (item) => item.min <= difference && difference <= item.max
        );

        if (!res) {
            setData((prev) => ({
                ...prev,
                result: "",
            }));
            return;
        }

        const condition = +data.myRanking.value < +data.opponentRanking.value;

        const getResultValue = (value: "1" | "0", condition: boolean) => {
            const resultMap = {
                "1": condition ? res?.uventetGevinst : res?.ventetGevinst,
                "0": condition ? res?.ventetFradrag : res?.uventetFradrag,
            };

            const result = resultMap[value] ?? 0;
            return result === 0
                ? `${result}`
                : `${value === "1" ? "+" : "-"}${result}`;
        };

        setData((prev) => ({
            ...prev,

            result: getResultValue(value as "1" | "0", condition),
        }));
    };

    const keyDownHandler = (event: KeyboardEvent<HTMLLabelElement>) => {
        const { code } = event;
        const { htmlFor } = event.target as HTMLLabelElement;

        if (htmlFor === "vundet" && code === "ArrowUp") {
            if (opponentRankingRef.current) {
                (opponentRankingRef.current as HTMLInputElement).focus();
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

        if (code === "Enter" || code === "Space") {
            const value =
                (event.target as HTMLLabelElement).htmlFor === "vundet"
                    ? "1"
                    : "0";
            setData((prev) => ({
                ...prev,
                option: value,
            }));
            resultHandle(value);
        }
    };

    const onBlurInput = (event: FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        resultHandle(data.option);
        setData((prev) => ({
            ...prev,
            [name]: {
                value: value,
                error: "",
            },
        }));
    };

    const onKeyDownInputOpponentRanking = (
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        const { code } = event;

        if (code === "ArrowUp") {
            if (myRankingRef.current) {
                (myRankingRef.current as HTMLInputElement).focus();
            }
        }
        if (code === "ArrowDown") {
            if (labelWinRef.current) {
                (labelWinRef.current as HTMLInputElement).focus();
            }
        }
    };

    const onKeyDownInputMyRanking = (
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        const { code } = event;

        if (code === "ArrowDown") {
            if (opponentRankingRef.current) {
                (opponentRankingRef.current as HTMLInputElement).focus();
            }
        }
    };

    return (
        <>
            <title>Rangeringsberegner hjemmeside</title>
            <meta
                name="description"
                content="Rangering beregner hjemmeside, hvor du kan beregne din rangeringsgreb after kamp du vundet eller tabte"
            />

            <h1 className="text-2xl font-bold text-center pb-4">
                Rangeringsberegner
            </h1>
            <div className="max-w-[calc(100dvh-10%)] mx-auto px-4 grid ">
                <label className="grid gap-4 relative pb-6">
                    <span>Skriv din ranking: </span>
                    <span className="absolute bottom-0 left-2 text-red-500">
                        {data.myRanking.error}
                    </span>
                    <input
                        ref={myRankingRef}
                        autoFocus
                        type="tel"
                        inputMode="numeric"
                        name="myRanking"
                        className="outline outline-blue-500 focus:outline-blue-700 focus:outline-2 px-2 py-1 rounded"
                        value={data.myRanking.value}
                        onChange={handleChange}
                        onBlur={onBlurInput}
                        onKeyDown={onKeyDownInputMyRanking}
                    />
                </label>
                <label className="grid gap-4 relative pb-6">
                    <span>Skriv modstander ranking: </span>
                    <span className="absolute bottom-0 left-2 text-red-500">
                        {data.opponentRanking.error}
                    </span>
                    <input
                        ref={opponentRankingRef}
                        type="tel"
                        inputMode="numeric"
                        name="opponentRanking"
                        className="outline outline-blue-500  focus:outline-blue-700 focus:outline-2 px-2 py-1 rounded"
                        value={data.opponentRanking.value}
                        onChange={handleChange}
                        onBlur={onBlurInput}
                        onKeyDown={onKeyDownInputOpponentRanking}
                    />
                </label>
                <fieldset className="p-4 border border-gray-300 rounded-lg">
                    <legend className="pb-4 text-lg font-semibold text-gray-700">
                        Er du vundet eller tabte kamp?
                    </legend>

                    <div className="flex flex-col gap-3">
                        {/* Vundet */}
                        <label
                            ref={labelWinRef}
                            onKeyDown={keyDownHandler}
                            htmlFor="vundet"
                            tabIndex={0}
                            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
        border-gray-300 hover:border-green-500 peer-checked:border-green-500 peer-checked:bg-blue-100">
                            <input
                                id="vundet"
                                type="radio"
                                name="option"
                                value="1"
                                checked={data.option === "1"}
                                onChange={radioHandle}
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

                        {/* Tabt */}
                        <label
                            onKeyDown={keyDownHandler}
                            htmlFor="tabt"
                            tabIndex={0}
                            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all 
        border-gray-300 hover:border-red-500 peer-checked:border-red-500 peer-checked:bg-red-100">
                            <input
                                type="radio"
                                name="option"
                                value="0"
                                id="tabt"
                                checked={data.option === "0"}
                                onChange={radioHandle}
                                className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition-all">
                                <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <PiSmileySad className="text-2xl text-red-500" />
                            <span className="text-gray-700">
                                Nej, jeg tabte
                            </span>
                        </label>
                    </div>
                </fieldset>

                <div className="flex gap-2">
                    Din resultat:
                    <span
                        className={
                            +data.result > 0
                                ? "text-green-500"
                                : +data.result < 0
                                ? "text-red-500"
                                : "text-black"
                        }>
                        {data.result} {data.result && "points"}
                    </span>
                </div>
            </div>
        </>
    );
}

export default App;
