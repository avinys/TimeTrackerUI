import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ProjectTimeDto } from "../types/projectTime.types";

type ProjectTimesContextType = {
	projectTimes: ProjectTimeDto[];
	setProjectTimes: React.Dispatch<React.SetStateAction<ProjectTimeDto[]>>;
};

const ProjectTimesContext = createContext<ProjectTimesContextType | undefined>(
	undefined
);

export const useProjectTimes = () => {
	const context = useContext(ProjectTimesContext);
	if (!context)
		throw new Error(
			"useProjectTimes must be used within ProjectTimesProvider"
		);
	return context;
};

export const ProjectTimesProvider = ({ children }: { children: ReactNode }) => {
	const [projectTimes, setProjectTimes] = useState<ProjectTimeDto[]>([]);

	return (
		<ProjectTimesContext.Provider value={{ projectTimes, setProjectTimes }}>
			{children}
		</ProjectTimesContext.Provider>
	);
};
