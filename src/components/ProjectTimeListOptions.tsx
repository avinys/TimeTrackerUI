import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { SortByProjectTimes as SortBy } from '../types/projectTime.types'
import styles from '../styles/projectTimeListOptions.module.css'

type ProjectTimeListOptionsProps = {
  sortBy: string
  setSortBy: Dispatch<SetStateAction<SortBy>>
  showExpander: boolean
  setShowExpander: Dispatch<SetStateAction<boolean>>
  pageItems: number
  setPageItems: Dispatch<SetStateAction<number>>
}

function ProjectTimeListOptions({
  sortBy = 'date-desc',
  setSortBy,
  showExpander = false,
  setShowExpander,
  pageItems,
  setPageItems
}: ProjectTimeListOptionsProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
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

export default ProjectTimeListOptions
