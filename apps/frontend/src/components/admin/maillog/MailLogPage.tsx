import axios from 'axios'
import { Button, KIND } from 'baseui/button'
import { Card } from 'baseui/card'
import { TriangleDown } from 'baseui/icon'
import { StatefulMenu } from 'baseui/menu'
import { Pagination } from 'baseui/pagination'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { HeadingMedium, HeadingXSmall } from 'baseui/typography'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { IPageResponse } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { theme } from '../../../util'
import { env } from '../../../util/env'
import { Markdown } from '../../common/Markdown'

interface IMailLog {
  time: string
  to: string
  subject: string
  body: string
}

const getMailLog = async (start: number, count: number): Promise<IPageResponse<IMailLog>> => {
  return (
    await axios.get<IPageResponse<IMailLog>>(
      `${env.pollyBaseUrl}/audit/maillog?pageNumber=${start}&pageSize=${count}`
    )
  ).data
}

export const MailLogPage = () => {
  const [log, setLog] = useState<IPageResponse<IMailLog>>({
    content: [],
    numberOfElements: 0,
    pageNumber: 0,
    pages: 0,
    pageSize: 1,
    totalElements: 0,
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  ampli.logEvent('besøk', {
    side: 'Admin',
    url: '/admin/maillog',
    app: 'Behandlingskatalogen',
    type: 'Mail log',
  })

  useEffect(() => {
    getMailLog(page - 1, limit).then(setLog)
  }, [page, limit])

  const handlePageChange = (nextPage: number): void => {
    if (nextPage < 1) {
      return
    }
    if (nextPage > log.pages) {
      return
    }
    setPage(nextPage)
  }

  useEffect(() => {
    const nextPageNum: number = Math.ceil(log.totalElements / limit)
    if (log.totalElements && nextPageNum < page) {
      setPage(nextPageNum)
    }
  }, [limit, log.totalElements])

  return (
    <>
      <HeadingMedium>Mail log</HeadingMedium>
      {log?.content.map((logList: IMailLog, index: number) => {
        let html: string = logList.body
        const bodyIdx: number = logList.body.indexOf('<body>')
        if (bodyIdx >= 0) {
          html = html.substring(logList.body.indexOf('<body>') + 6)
          html = html.substring(0, html.lastIndexOf('</body>'))
        }
        // some odd bug in html parser didnt like newlines inside <ul>
        html = html.replace(/\n/g, '')
        const rowNum: number = log.pageNumber * log.pageSize + index + 1

        return (
          <div key={index} className="mb-6">
            <HeadingXSmall marginBottom={0}>
              #{rowNum} Tid: {moment(logList.time).format('lll')} Til: {logList.to}
            </HeadingXSmall>
            <HeadingXSmall marginTop={0} marginBottom={theme.sizing.scale400}>
              Emne: {logList.subject}
            </HeadingXSmall>
            <Card>
              <Markdown source={html} escapeHtml={false} />
            </Card>
          </div>
        )
      })}

      <div className="flex justify-between mt-4">
        <StatefulPopover
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map((items) => ({ label: items }))}
              onItemSelect={({ item }) => {
                setLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
                },
              }}
            />
          )}
          placement={PLACEMENT.bottom}
        >
          <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>{`${limit} Rader`}</Button>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={log.pages}
          onPageChange={({ nextPage }) => handlePageChange(nextPage)}
          labels={{ nextButton: 'Neste', prevButton: 'Forrige' }}
        />
      </div>
    </>
  )
}
