import { Block } from 'baseui/block'
import React from 'react'
import { Cell, HeadCell, Row, Table } from '../common/Table'

type AAregHjemmelDataTextProps = {
  data: string
}

export const AAregHjemmelDataText = (props: AAregHjemmelDataTextProps) => {
  const rawData = props.data ? prepareString(props.data).split('\n') : []

  const purposeList = rawData.filter((d) => d.match('Formål:')).map((a) => a.replace('Formål:', ''))
  const authoryList = rawData.filter((d) => d.match('Hjemmel:')).map((a) => a.replace('Hjemmel:', ''))
  const processorList = rawData.filter((d) => d.match('Behandlingsgrunnlag:')).map((a) => a.replace('Behandlingsgrunnlag:', ''))

  return (
    <Block>
      <Table
        emptyText='Ikke angitt'
        headers={
          <>
            <HeadCell title='Formål med behandlingen' />
            <HeadCell title='NAVs hjemmel for utlevering' />
            <HeadCell title='Konsumentens hjemmel for behandlingen' />
          </>
        }
      >
        {purposeList.map((a, i) => (
          <Row key={a + '_' + i}>
            <Cell>
              <Block>{a}</Block>
            </Cell>
            <Cell>
              <Block>{authoryList[i]}</Block>
            </Cell>
            <Cell>
              <Block>{processorList[i]}</Block>
            </Cell>
          </Row>
        ))}
      </Table>
    </Block>
  )
}
export default AAregHjemmelDataText

const prepareString = (text: string) => {
  return text.replace('\n\n', ' ').replace('\n\n\n', ' ')
}
