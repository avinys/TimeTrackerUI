import { useEffect, useState, useRef } from 'react';
import { useProjectTimes } from '../context/ProjectTimesContext';
import type { ProjectTimeDto, CreateProjectTimeDto, UpdateProjectTimeDto } from '../types/projectTime.types';
import { ProjectTimeService } from '../services/ProjectTimeService';
import { formatTime } from '../util/formatTime';
import styles from "../styles/projectTimeClock.module.css";
import clsx from 'clsx';

type ProjectTimeClockProps = {
    projectId: number;
    refreshProjectTimes: ()=> void;
};

export default function ProjectTimeClock({ projectId, refreshProjectTimes }: ProjectTimeClockProps) {
    const [elapsed, setElapsed] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const { projectTimes, setProjectTimes } = useProjectTimes();

    console.log("reinitializing lastTime: ", projectTimes[projectTimes.length - 1])
    const lastTime = projectTimes[projectTimes.length - 1] || null;

    console.log("ProjectTimeClock.tsx: fetched projectTimes:", projectTimes)
    
    useEffect(() => { 
        const start = lastTime ? new Date(lastTime.startTime) : null;
        const end = lastTime?.endTime ? new Date(lastTime.endTime) : null;
        const isOngoing = start && !end;

        if (isOngoing) {
            // To solve a problem of parsing as local time (2 hours difference)- For some reason fixed
            const startTime = new Date(lastTime.startTime);
            const initial = Math.floor((Date.now() - startTime.getTime()) / 1000);
            console.log("Initial time, startTime", initial, startTime, lastTime.startTime);
            setElapsed(initial);
            setTimerRunning(true);

            intervalRef.current = window.setInterval(() => {
                setElapsed((prev) => prev + 1);
            }, 1000);
        } else {
            setTimerRunning(false);
        }

        return () => {
            if (intervalRef.current) {
            clearInterval(intervalRef.current);
            }
        };
    }, [projectTimes]);

    const handleStart = async () => {
        const data: CreateProjectTimeDto = {
            projectId: projectId
        };
        const newProjectTime = await ProjectTimeService.createProjectTime(data);
        setProjectTimes([...projectTimes, newProjectTime]);
    }

    const handleStop = async () => {
        if (!lastTime) {
            console.log('ProjectTimeClock.tsx: Terminating because lastTime in null: ', lastTime)
            return;
        }
        
        const data: UpdateProjectTimeDto = {
            projectTimeId: lastTime.id,
            startTime: lastTime.startTime
        }

        console.log("ProjectTimeClock.tsx: requesting update:", data)

        const updatedProjectTime: ProjectTimeDto = await ProjectTimeService.updateProjectTime(data);

        const updatedProjectTimeList = projectTimes.map((pt) =>
          pt.id === updatedProjectTime.id ? updatedProjectTime : pt
        );

        setElapsed(0);
        //setTimerRunning(false);
        setProjectTimes(updatedProjectTimeList);
    }

    return (
        <div className={styles.clockContainer}>
        <h2 className={styles.clockTime}>{formatTime(elapsed)}</h2>
        <div>
            <button className={clsx('btn', styles.clockButton)} onClick={handleStart} disabled={timerRunning}>Start</button>
            <button className={clsx('btn-alt', styles.clockButton)} onClick={handleStop} disabled={!timerRunning}>Stop</button>
        </div>
        </div>
    );
}