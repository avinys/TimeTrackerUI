import { useState, useEffect } from 'react';
import type { ProjectTimeDto } from "../types/projectTime.types";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

type SummaryDashboardPropsType = {
    startDate: Date,
    endDate: Date,
    projectTimes: ProjectTimeDto[]
}

export default function SummaryDashboard({ startDate, endDate, projectTimes }: SummaryDashboardPropsType) {
    const [average, setAverage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {

    }, [startDate, endDate, projectTimes]);
    
    return (
        <div className="container">
            <h2>Average work time per day: {average}</h2>
            <h2>Total work time per selected period: {total}</h2>
        </div>
    )
}