import { Heading, NavList } from '@primer/react'
import { useEffect, useState } from 'react'
import cx from 'classnames'

import type { MiniTocItem } from 'components/context/ArticleContext'
import { useTranslation } from 'components/hooks/useTranslation'

import styles from './Minitocs.module.scss'

export type MiniTocsPropsT = {
  miniTocItems: MiniTocItem[]
}

function RenderTocItem(item: MiniTocItem) {
  const [currentAnchor, setCurrentAnchor] = useState('')

  useEffect(() => {
    const onHashChanged = () => {
      setCurrentAnchor(window.location.hash)
    }

    window.addEventListener('hashchange', onHashChanged)

    return () => {
      window.removeEventListener('hashchange', onHashChanged)
    }
  }, [])

  return (
    <div className={cx(styles.nested, item.platform)}>
      <NavList.Item
        aria-current={item.contents.href === currentAnchor && 'location'}
        href={item.contents.href}
      >
        {item.contents.title}
      </NavList.Item>
      {item.items && item.items.length > 0 && (
        <ul className={cx(styles.indentNested)}>
          {item.items.map((toc) => (
            <RenderTocItem
              key={toc.contents.href}
              contents={toc.contents}
              items={toc.items}
              platform={toc.platform}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export function MiniTocs({ miniTocItems }: MiniTocsPropsT) {
  const { t } = useTranslation('pages')

  return (
    <>
      <Heading
        as="h2"
        id="in-this-article"
        className="mb-1 ml-3"
        sx={{ fontSize: 1 }}
        aria-label={t('miniToc')}
      >
        {t('miniToc')}
      </Heading>

      <NavList className={cx(styles.miniToc, 'my-2')}>
        {miniTocItems.map((items, i) => {
          return (
            <RenderTocItem
              key={items.contents.href + i}
              contents={items.contents}
              items={items.items}
              platform={items.platform}
            />
          )
        })}
      </NavList>
    </>
  )
}
