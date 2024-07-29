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
    <div>
      <Table
        emptyText="Ikke angitt"
        headers={
          <>
            <HeadCell title="Formål med behandlingen" />
            <HeadCell title="NAVs hjemmel for utlevering" />
            <HeadCell title="Konsumentens hjemmel for behandlingen" />
          </>
        }
      >
        {purposeList.map((a, i) => (
          <Row key={a + '_' + i}>
            <Cell>
              <div>{a}</div>
            </Cell>
            <Cell>
              <div>{authoryList[i]}</div>
            </Cell>
            <Cell>
              <div>{processorList[i]}</div>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
export default AAregHjemmelDataText

const prepareString = (text: string) => {
  return text.replace('\n\n', ' ').replace('\n\n\n', ' ')
}
