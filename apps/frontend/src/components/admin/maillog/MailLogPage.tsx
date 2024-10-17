import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown } from '@navikt/ds-react'
import {BodyShort, Box, Heading, Pagination,} from "@navikt/ds-react";
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { IPageResponse } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
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
  const [rowsPerPage, setRowsPerPage] = useState(20)

  ampli.logEvent('besøk', {
    side: 'Admin',
    url: '/admin/maillog',
    app: 'Behandlingskatalogen',
    type: 'Mail log',
  })

  useEffect(() => {
    getMailLog(page - 1, rowsPerPage).then(setLog)
  }, [page, rowsPerPage])


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
    const nextPageNum: number = Math.ceil(log.totalElements / rowsPerPage)
    if (log.totalElements && nextPageNum < page) {
      setPage(nextPageNum)
    }
  }, [rowsPerPage, log.totalElements])

  return (
    <div className="w-full px-16" role="main">
      <Heading className="mt-4" size="large" level="1" spacing>Logg for sendt e-post</Heading>
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
            <BodyShort>
              #{rowNum} Tid: {moment(logList.time).format('lll')} Til: {logList.to}
            </BodyShort>
            <BodyShort className="mb-3">
              Emne: {logList.subject}
            </BodyShort>
            <Box
              className="px-2"
              borderWidth="2"
              borderColor="border-subtle"
              borderRadius="large"
              background="surface-default">
              <Markdown source={html} escapeHtml={false}/>
            </Box>
          </div>
        )
      })}

      <div className="flex justify-between mt-4">
        <Dropdown>
          <Button variant="tertiary" as={Dropdown.Toggle}>
            {`${rowsPerPage} Rader`}{' '}
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '.5rem' }} />
          </Button>
          <Dropdown.Menu className="w-fit">
            <Dropdown.Menu.List>
              {[5, 10, 20, 50, 100].map((pageSize: number) => (
                <Dropdown.Menu.List.Item
                  key={'pageSize_' + pageSize}
                  as={Button}
                  onClick={() => setRowsPerPage(pageSize)}
                >
                  {pageSize}
                </Dropdown.Menu.List.Item>
              ))}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
        <Pagination
          currentPage={page}
          numPages={log.pages}
          onPageChange={({ nextPage }) => handlePageChange(nextPage)}
          labels={{ nextButton: 'Neste', prevButton: 'Forrige' }}
        />
      </div>
    </div>
  )
}
