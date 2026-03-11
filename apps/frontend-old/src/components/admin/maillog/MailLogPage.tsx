import { BodyShort, Box, Heading, Pagination, Select, Spacer } from '@navikt/ds-react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { IPageResponse } from '../../../constants'
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

  useEffect(() => {
    getMailLog(page - 1, rowsPerPage).then(setLog)
  }, [page, rowsPerPage])

  return (
    <div className="w-full px-16" role="main">
      <Heading className="mt-4" size="large" level="1" spacing>
        Logg for sendt e-post
      </Heading>
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
            <BodyShort className="mb-3">Emne: {logList.subject}</BodyShort>
            <Box
              className="px-2"
              borderWidth="2"
              borderColor="neutral-subtle"
              borderRadius="8"
              background="default"
            >
              <Markdown source={html} escapeHtml={false} />
            </Box>
          </div>
        )
      })}

      <div className="flex w-full justify-center items-center mt-3">
        <Select
          label="Antall rader:"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          size="small"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <Spacer />
        <div>
          <Pagination
            page={page}
            onPageChange={setPage}
            count={log.pages ? log.pages : 1}
            prevNextTexts
            size="small"
          />
        </div>
        <Spacer />
        <BodyShort>Totalt antall rader: {log.totalElements}</BodyShort>
      </div>
    </div>
  )
}
