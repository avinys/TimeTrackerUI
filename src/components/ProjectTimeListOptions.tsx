import type { Dispatch, SetStateAction } from "react";
import type { SortBy } from "../types/projectTime.types";
import styles from "../styles/projectTimeListOptions.module.css";

type ProjectTimeListOptionsProps = {
	sortBy: string;
	setSortBy: Dispatch<SetStateAction<SortBy>>;
	showExpander: boolean;
	setShowExpander: Dispatch<SetStateAction<boolean>>;
};

function ProjectTimeListOptions({
	sortBy = "date-desc",
	setSortBy,
	showExpander = false,
	setShowExpander,
}: ProjectTimeListOptionsProps) {
	return (
		<div className={styles.container}>
			<div className={styles.inputGroup}>
				<label htmlFor="sort">Sort by:</label>
				<select
					id="sort"
					value={sortBy}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						setSortBy(e.target.value as SortBy)
					}
				>
					<option value="date-desc">Date (newest first)</option>
					<option value="date-asc">Date (oldest first)</option>
					<option value="duration-desc">Duration (longest first)</option>
					<option value="duration-asc">Duration (shortest first)</option>
				</select>
			</div>
			<div className={styles.inputGroup}>
				<input
					type="checkbox"
					name="showExpander"
					id="showExpander"
					checked={showExpander}
					onChange={() => setShowExpander((prev) => !prev)}
				/>
				<label htmlFor="showExpander">Truncate comments?</label>
			</div>
		</div>
	);
}

export default ProjectTimeListOptions;
