import type { Dispatch, SetStateAction } from "react";
import type { SortByProjects as SortBy } from "../types/project.types";
import styles from "../styles/ProjectListSearchOptions.module.css";

type ProjectListSearchOptionsProps = {
	search: string;
	setSearch: Dispatch<SetStateAction<string>>;
	sortBy: SortBy;
	setSortBy: Dispatch<SetStateAction<SortBy>>;
};

function ProjectListSearchOptions({
	search,
	setSearch,
	sortBy,
	setSortBy,
}: ProjectListSearchOptionsProps) {
	return (
		<div className={styles.container}>
			<div className={styles.searchInputGroup}>
				<input
					className={styles.searchInput}
					type="text"
					id="search-projects"
					name="search-projects"
					placeholder="Search projects"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className={styles.sortInputGroup}>
				<label className={styles.sortLabel} htmlFor="sort-projects">
					Sort by:
				</label>
				<select
					id="sort-projects"
					name="sort-projects"
					value={sortBy}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						setSortBy(e.target.value as SortBy)
					}
				>
					<option value="date-desc">Date (newest first)</option>
					<option value="date-asc">Date (oldest first)</option>
					<option value="name-asc">Name (A -&gt; Z)</option>
					<option value="name-desc">Name (Z -&gt; A)</option>
				</select>
			</div>
		</div>
	);
}

export default ProjectListSearchOptions;
