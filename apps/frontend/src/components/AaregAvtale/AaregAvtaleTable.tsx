import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Panel, StatelessAccordion } from 'baseui/accordion'
import { KIND } from 'baseui/button'
import { StatefulMenu } from 'baseui/menu'
import { Pagination } from 'baseui/pagination'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { HeadingLarge, LabelLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { IAaregAvtale } from '../../constants'
import { theme } from '../../util'
import Button from '../common/Button'
import DataText from '../common/DataText'
import AAregHjemmelDataText from './AAregHjemmelDataText'

type TAaregAvtaleTableProps = {
  aaregAvtaler: IAaregAvtale[]
}

const marginTop = '2rem'

interface ICustomPanelLabelProps {
  text: any
}

const CustomPanelLabel = ({ text }: ICustomPanelLabelProps) => (
  <div className="w-full mb-4 border-b border-solid border-[#AFAFAF]">
    <LabelLarge marginTop={marginTop}>{text}</LabelLarge>
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
  const [selectedAaregAvtale, setSelectedAaregAvtale] = useState<string>()

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
      <HeadingLarge>Utleveringsavtaler i Aa-registeret</HeadingLarge>
      <StatelessAccordion
        onChange={({ expanded }) => {
          setSelectedAaregAvtale(expanded[0] as string)
        }}
        expanded={selectedAaregAvtale ? [selectedAaregAvtale] : []}
      >
        {sortedAaregAvtale &&
          sortedAaregAvtale.map((aaregisterAvtale) => {
            const expanded: boolean = selectedAaregAvtale === aaregisterAvtale.avtalenummer

            return (
              <Panel
                key={aaregisterAvtale.avtalenummer}
                title={
                  <div className="w-full">
                    <LabelLarge color={theme.colors.primary}>
                      {expanded ? (
                        <FontAwesomeIcon icon={faChevronDown} />
                      ) : (
                        <FontAwesomeIcon icon={faChevronRight} />
                      )}
                      <span> </span>
                      <span>
                        {aaregisterAvtale.virksomhet} - (Avtalenummer-
                        {aaregisterAvtale.avtalenummer.replace('AVT-', '')})
                      </span>
                    </LabelLarge>
                  </div>
                }
                overrides={{
                  ToggleIcon: {
                    component: () => null,
                  },
                  Content: {
                    style: {
                      backgroundColor: theme.colors.white,
                      // Outline width
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                    },
                  },
                }}
              >
                <div className="outline-4 outline-[#99c2e8] outline">
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
              </Panel>
            )
          })}
      </StatelessAccordion>

      <div className="flex justify-between mt-1">
        <StatefulPopover
          placement={PLACEMENT.bottom}
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map((item: number) => ({ label: item }))}
              onItemSelect={({ item }) => {
                setPageLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
                },
              }}
            />
          )}
        >
          <div>
            <Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${pageLimit} Rader`}</Button>
          </div>
        </StatefulPopover>
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
