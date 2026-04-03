import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [tableData, setTableData] = useState([]);
    const [avgEfficiency, setAvgEfficiency] = useState(0);
    const [avgSpeed, setAvgSpeed] = useState(0);
    const [runningCount, setRunningCount] = useState(0);
    const [stoppedCount, setStoppedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState("none");
    const [groupBy, setGroupBy] = useState("none");
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRange, setSelectedRange] = useState("all");
    const [effCounts, setEffCounts] = useState({
        "90-100": 0,
        "80-90": 0,
        "70-80": 0,
        "60-70": 0,
        "0-60": 0,
    });

    const fetchData = async () => {
        const EMB_URL = import.meta.env.VITE_EMB_URL;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${EMB_URL}/Api/data/getliveproductionOld`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            if (res.ok) {
                const machines = data.ResultData.LiveProductionData;

                setTableData(machines);

                // ✅ Running / Stopped
                const running = machines.filter(m => m.IsRun === true || m.IsRun === "true").length;
                const stopped = machines.filter(m => m.IsRun === false || m.IsRun === "false").length;

                setRunningCount(running);
                setStoppedCount(stopped);
                setTotalCount(machines.length);

                const counts = {
                    "90-100": 0,
                    "80-90": 0,
                    "70-80": 0,
                    "60-70": 0,
                    "0-60": 0,
                };

                machines.forEach(m => {
                    const eff = Number(m.Efficiency || 0);

                    if (eff >= 90) counts["90-100"]++;
                    else if (eff >= 80) counts["80-90"]++;
                    else if (eff >= 70) counts["70-80"]++;
                    else if (eff >= 60) counts["60-70"]++;
                    else counts["0-60"]++;
                });

                setEffCounts(counts);

                // ✅ Efficiency
                const totalEff = machines.reduce((sum, m) => sum + Number(m.Efficiency || 0), 0);
                setAvgEfficiency(machines.length ? (totalEff / machines.length).toFixed(2) : 0);

                // ✅ Speed
                const totalSpd = machines.reduce((sum, m) => sum + Number(m.Speed || 0), 0);
                setAvgSpeed(machines.length ? (totalSpd / machines.length).toFixed(0) : 0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 🔁 Run API ONLY ONCE here
    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DataContext.Provider value={{
            tableData,
            avgEfficiency,
            avgSpeed,
            runningCount,
            stoppedCount,
            totalCount,
            sortBy, setSortBy,
            groupBy, setGroupBy,
            selectedGroup, setSelectedGroup,
            statusFilter, setStatusFilter,
            selectedRange, setSelectedRange,
            effCounts
        }}>
            {children}
        </DataContext.Provider>
    );
};

// custom hook
export const useData = () => useContext(DataContext);