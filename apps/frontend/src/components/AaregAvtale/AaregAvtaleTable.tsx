import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Button, Dropdown, Heading, Label } from '@navikt/ds-react'
import { Pagination } from 'baseui/pagination'
import { useEffect, useState } from 'react'
import { IAaregAvtale } from '../../constants'
import { theme } from '../../util'
import DataText from '../common/DataText'
import AAregHjemmelDataText from './AAregHjemmelDataText'

type TAaregAvtaleTableProps = {
  aaregAvtaler: IAaregAvtale[]
}

interface ICustomPanelLabelProps {
  text: any
}

const CustomPanelLabel = ({ text }: ICustomPanelLabelProps) => (
  <div className="w-full mb-4 border-b border-solid border-[#AFAFAF]">
    <Label className="mt-2">{text}</Label>
  </div>
)

export const sortAaregAvtaleList = (aaregAvtaler: IAaregAvtale[]): IAaregAvtale[] => {
  return aaregAvtaler.sort((a: IAaregAvtale, b: IAaregAvtale) => {
    if (a.virksomhet > b.virksomhet) {
      return 1
    } else if (a.virksomhet < b.virksomhet) {
      return -1
    } else {
      if (a.avtalenummer > b.avtalenummer) {
        return 1
      } else if (a.avtalenummer < b.avtalenummer) {
        return -1
      } else {
        return 0
      }
    }
  })
}

export const AaregAvtaleTable = (props: TAaregAvtaleTableProps) => {
  const { aaregAvtaler } = props
  const [pageLimit, setPageLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortedAaregAvtale, setSortedAaregAvtale] = useState<IAaregAvtale[]>([])

  useEffect(() => {
    setSortedAaregAvtale(sortAaregAvtaleList(aaregAvtaler).slice(0, 10))
  }, [aaregAvtaler])

  useEffect(() => {
    setSortedAaregAvtale(
      sortAaregAvtaleList(aaregAvtaler).slice((page - 1) * pageLimit, pageLimit * page)
    )
  }, [pageLimit, page])

  return (
    <>
      <Heading size="large" level="2">
        Utleveringsavtaler i Aa-registeret
      </Heading>
      <Accordion>
        {sortedAaregAvtale &&
          sortedAaregAvtale.map((aaregisterAvtale) => (
            <Accordion.Item key={aaregisterAvtale.avtalenummer}>
              <Accordion.Header>
                <div className="w-full">
                  <Label color={theme.colors.primary}>
                    {aaregisterAvtale.virksomhet} - (Avtalenummer-
                    {aaregisterAvtale.avtalenummer.replace('AVT-', '')})
                  </Label>
                </div>
              </Accordion.Header>
              <Accordion.Content>
                <div className="outline outline-[#99c2e8]">
                  <div className="p-1">
                    <CustomPanelLabel text="Konsument" />
                    <DataText label="Navn" text={aaregisterAvtale.virksomhet || 'Ikke angitt'} />
                    <DataText
                      label="Organisasjonsnummer"
                      text={aaregisterAvtale.organisasjonsnummer || 'Ikke angitt'}
                    />

                    <CustomPanelLabel text="Avtale" />
                    <DataText
                      label="Avtalenummer"
                      text={aaregisterAvtale.avtalenummer || 'Ikke angitt'}
                    />
                    <DataText
                      label="Dato opprettet"
                      text={aaregisterAvtale.opprettet || 'Ikke angitt'}
                    />

                    <CustomPanelLabel text="Formål, Hjemmel og Behandlingsgrunnlag" />

                    <AAregHjemmelDataText
                      data={aaregisterAvtale.hjemmel_behandlingsgrunnlag_formal}
                    />

                    <CustomPanelLabel text="Type tilgang" />
                    <DataText
                      label="API"
                      text={
                        aaregisterAvtale.integrert_oppslag_api
                          ? 'Tilgjengelig'
                          : 'Ikke tilgjengelig'
                      }
                    />
                    <DataText
                      label="Uttrekk"
                      text={aaregisterAvtale.uttrekk ? 'Tilgjengelig' : 'Ikke tilgjengelig'}
                    />
                    <DataText
                      label="Web-oppslag"
                      text={aaregisterAvtale.web_oppslag ? 'Tilgjengelig' : 'Ikke tilgjengelig'}
                    />
                    <DataText
                      label="Hendelser"
                      text={aaregisterAvtale.hendelser ? 'Tilgjengelig' : 'Ikke tilgjengelig'}
                    />

                    <CustomPanelLabel text="Databehandler" />
                    <DataText
                      label="Organisasjonsnummer"
                      text={aaregisterAvtale.databehandler_organisasjonsnummer || 'Ikke angitt'}
                    />
                    <DataText
                      label="Navn"
                      text={aaregisterAvtale.databehandler_navn || 'Ikke angitt'}
                    />
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
      </Accordion>

      <div className="flex justify-between mt-1">
        <Dropdown>
          <Button variant="tertiary" as={Dropdown.Toggle}>
            {`${pageLimit} Rader`}{' '}
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '.5rem' }} />
          </Button>
          <Dropdown.Menu className="w-fit">
            <Dropdown.Menu.List>
              {[5, 10, 20, 50, 100].map((pageSize: number) => (
                <Dropdown.Menu.List.Item
                  key={'pageSize_' + pageSize}
                  as={Button}
                  onClick={() => setPageLimit(pageSize)}
                >
                  {pageSize}
                </Dropdown.Menu.List.Item>
              ))}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>

        <Pagination
          currentPage={page}
          numPages={Math.ceil(aaregAvtaler.length / pageLimit)}
          onPageChange={(page: { nextPage: number; prevPage: number }) => setPage(page.nextPage)}
          labels={{ nextButton: 'Neste', preposition: 'av', prevButton: 'Forrige' }}
        />
      </div>
    </>
  )
}

export default AaregAvtaleTable
