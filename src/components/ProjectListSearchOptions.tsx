import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { SortByProjects as SortBy } from '../types/project.types'
import styles from '../styles/ProjectListSearchOptions.module.css'

type ProjectListSearchOptionsProps = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  sortBy: SortBy
  setSortBy: Dispatch<SetStateAction<SortBy>>
  showCompleted: boolean
  setShowCompleted: Dispatch<SetStateAction<boolean>>
  pageItems: number
  setPageItems: Dispatch<SetStateAction<number>>
}

function ProjectListSearchOptions({
  search,
  setSearch,
  sortBy,
  setSortBy,
  showCompleted,
  setShowCompleted,
  pageItems,
  setPageItems
}: ProjectListSearchOptionsProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [openMenu])

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

      <button
        ref={btnRef}
        type="button"
        className={styles.hamburgerButton}
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <div ref={menuRef} className={`${styles.filtersMenu} ${openMenu ? styles.open : ''}`}>
        <div className={styles.showCompletedInputGroup}>
          <input
            className={styles.showCompletedInput}
            type="checkbox"
            id="show-completed"
            name="show-completed"
            checked={showCompleted}
            onChange={() => setShowCompleted((prev) => !prev)}
          />
          <label htmlFor="show-completed">Show completed?</label>
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
        <div className={styles.pageItemsInputGroup}>
          <label className={styles.pageItemsLabel} htmlFor="page-items">
            Show items:{' '}
          </label>
          <select
            id="page-items"
            name="page-items"
            value={pageItems}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPageItems(Number(e.target.value))
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="-1">all</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ProjectListSearchOptions
