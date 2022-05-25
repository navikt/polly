import React, {useEffect, useState} from "react"
import {HeadingMedium, HeadingXSmall} from 'baseui/typography'
import axios from 'axios'
import {env} from '../../util/env'
import {PageResponse} from '../../constants'
import {Block} from 'baseui/block'
import {Card} from 'baseui/card'
import moment from 'moment'
import {intl, theme} from '../../util'
import {PLACEMENT, StatefulPopover} from 'baseui/popover'
import {StatefulMenu} from 'baseui/menu'
import {Button, KIND} from 'baseui/button'
import {TriangleDown} from 'baseui/icon'
import {Pagination} from 'baseui/pagination'
import {Markdown} from '../../components/common/Markdown'

interface MailLog {
  time: string
  to: string
  subject: string
  body: string
}

const getMailLog = async (start: number, count: number) => {
  return (await axios.get<PageResponse<MailLog>>(`${env.pollyBaseUrl}/audit/maillog?pageNumber=${start}&pageSize=${count}`)).data
}

export const MailLogPage = () => {
  const [log, setLog] = useState<PageResponse<MailLog>>({content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    getMailLog(page - 1, limit).then(setLog)
  }, [page, limit])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return
    }
    if (nextPage > log.pages) {
      return
    }
    setPage(nextPage)
  }

  useEffect(() => {
    const nextPageNum = Math.ceil(log.totalElements / limit)
    if (log.totalElements && nextPageNum < page) {
      setPage(nextPageNum)
    }
  }, [limit, log.totalElements])

  return <>
    <HeadingMedium>{intl.mailLog}</HeadingMedium>
    {log?.content.map((l, i) => {
      let html = l.body
      const bodyIdx = l.body.indexOf('<body>')
      if (bodyIdx >= 0) {
        html = html.substring(l.body.indexOf('<body>') + 6)
        html = html.substring(0, html.lastIndexOf('</body>'))
      }
      // some odd bug in html parser didnt like newlines inside <ul>
      html = html.replace(/\n/g, '')
      const rowNum = log.pageNumber * log.pageSize + i + 1

      return <Block key={i} marginBottom={theme.sizing.scale800}>
        <HeadingXSmall marginBottom={0}>#{rowNum} Tid: {moment(l.time).format('lll')} Til: {l.to}</HeadingXSmall>
        <HeadingXSmall marginTop={0} marginBottom={theme.sizing.scale400}>Emne: {l.subject}</HeadingXSmall>
        <Card>
          <Markdown
            source={html}
            escapeHtml={false}
          />
        </Card>
      </Block>
    })}


    <Block display="flex" justifyContent="space-between" marginTop="1rem">
      <StatefulPopover
        content={({close}) => (
          <StatefulMenu
            items={[5, 10, 20, 50, 100].map(i => ({label: i,}))}
            onItemSelect={({item}) => {
              setLimit(item.label)
              close()
            }}
            overrides={{
              List: {
                style: {height: '150px', width: '100px'},
              },
            }}
          />
        )}
        placement={PLACEMENT.bottom}
      >
        <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>{`${limit} ${intl.rows}`}</Button>
      </StatefulPopover>
      <Pagination
        currentPage={page}
        numPages={log.pages}
        onPageChange={({nextPage}) => handlePageChange(nextPage)}
        labels={{nextButton: intl.nextButton, prevButton: intl.prevButton}}
      />
    </Block>
  </>
}
