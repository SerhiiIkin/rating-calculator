import { ChangeEvent, useState } from "react";

function App() {
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
        if (name !== "myRanking" && name !== "opponentRanking") {
            return;
        }

        const regExp = /[^0-9]/g;

        setData((prev) => ({
            ...prev,
            option: "",
            result: "",
            [name]: {
                value: regExp.test(value)
                    ? prev[name].value
                    : +value < MAX_RANKING
                    ? value.replace(/[^0-9]/g, "")
                    : prev[name].value,
                error: regExp.test(value)
                    ? "Indtast venligst et nummer"
                    : +value < MAX_RANKING
                    ? ""
                    : `Du må ikke taste et tal over ${MAX_RANKING}`,
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
        if (data.myRanking.value === "" || data.opponentRanking.value === "") {
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

        if (value === "1") {
            if (+data.myRanking.value < +data.opponentRanking.value) {
                setData((prev) => ({
                    ...prev,
                    result:
                        res?.uventetGevinst == 0
                            ? `${res?.uventetGevinst}`
                            : `+${res?.uventetGevinst}`,
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    result:
                        res?.ventetGevinst == 0
                            ? `${res?.ventetGevinst}`
                            : `+${res?.ventetGevinst}`,
                }));
            }
        } else if (value === "0") {
            if (+data.myRanking.value < +data.opponentRanking.value) {
                setData((prev) => ({
                    ...prev,
                    result:
                        res?.ventetFradrag == 0
                            ? `${res?.ventetFradrag}`
                            : `-${res?.ventetFradrag}`,
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    result:
                        res?.uventetFradrag == 0
                            ? `${res?.uventetFradrag}`
                            : `-${res?.uventetFradrag}`,
                }));
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
            <div className="max-w-[calc(100dvh-10%)] mx-auto px-4 grid gap-4">
                <label className="grid gap-4 relative pb-6">
                    <span>Skriv din ranking: </span>
                    <span className="absolute bottom-0 left-2 text-red-500">
                        {data.myRanking.error}
                    </span>
                    <input
                        type="tel"
                        inputMode="numeric"
                        name="myRanking"
                        className="outline px-2 py-1 rounded"
                        value={data.myRanking.value}
                        onChange={handleChange}
                        onBlur={() => resultHandle(data.result)}
                    />
                </label>
                <label className="grid gap-4 relative pb-6">
                    <span>Skriv modstander ranking: </span>
                    <span className="absolute bottom-0 left-2 text-red-500">
                        {data.opponentRanking.error}
                    </span>
                    <input
                        type="tel"
                        inputMode="numeric"
                        name="opponentRanking"
                        className="outline px-2 py-1 rounded"
                        value={data.opponentRanking.value}
                        onChange={handleChange}
                        onBlur={() => resultHandle(data.result)}
                    />
                </label>

                <label className="flex gap-4">
                    <span>Er du vundet?</span>
                    <input
                        type="radio"
                        name="option"
                        value="1"
                        checked={data.option === "1"}
                        onChange={radioHandle}
                    />
                </label>
                <label className="flex gap-4">
                    <span>Er du tabte?</span>
                    <input
                        type="radio"
                        name="option"
                        value="0"
                        checked={data.option === "0"}
                        onChange={radioHandle}
                    />
                </label>

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
