import React, { useEffect, useMemo, useState, type ReactElement } from 'react'
import styles from '../styles/pagination.module.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

const paginate = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, (i + 1) * size)
  )

function Pagination({ children, pageSize = 10 }: { children: ReactElement[]; pageSize: number }) {
  const [pageNum, setPageNum] = useState<number>(1)

  const childArray = useMemo(() => React.Children.toArray(children), [children])
  const pages = useMemo(() => paginate(childArray, pageSize), [childArray, pageSize])
  useEffect(() => {
    if (pageNum > pages.length) setPageNum(pages.length)
    if (pageNum < 1) setPageNum(1)
  }, [pages.length, pageNum])

  return (
    <>
      {pages[pageNum - 1]}
      <ol className={styles.list}>
        <li key="chevron-left" className={styles.arrow}>
          <button className={styles.button} onClick={() => setPageNum((prev) => prev - 1)}>
            <ChevronLeftIcon />
          </button>
        </li>
        {pages.map((_, i) => (
          <li key={i} className={styles.listItem}>
            <button
              className={pageNum === i + 1 ? clsx(styles.button, styles.active) : styles.button}
              onClick={() => setPageNum(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li key="chevron-right" className={styles.arrow}>
          <button className={styles.button} onClick={() => setPageNum((prev) => prev + 1)}>
            <ChevronRightIcon />
          </button>
        </li>
      </ol>
    </>
  )
}

export default Pagination
