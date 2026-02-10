import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, BodyLong, Heading } from '@navikt/ds-react'
import { useState } from 'react'
import { ICodeUsage, IUse } from '../../constants'
import { CodelistService, EListName } from '../../service/Codelist'
import { theme } from '../../util'
import { useQueryParam } from '../../util/hooks'
import RouteLink from '../common/RouteLink'

type TInformationTypeAccordionProps = {
  categoryUsages: ICodeUsage[] | undefined
}

const ListCategoryInformationtype = ({ categoryUsages }: TInformationTypeAccordionProps) => {
  const category = useQueryParam('category')
  const [codelistUtils] = CodelistService()
  const [openCategory, setOpenCategory] = useState<string | undefined>(category || undefined)

  const categoryNotInUse =
    !!category &&
    !categoryUsages?.filter((c) => c.code === category).flatMap((u) => u.informationTypes).length

  const panelList = () => {
    if (!categoryUsages) return
    return categoryUsages
      .filter((categoryUsage: ICodeUsage) => categoryUsage.informationTypes.length > 0)
      .sort((a, b) =>
        codelistUtils
          .getShortname(a.listName, a.code)
          .localeCompare(codelistUtils.getShortname(b.listName, b.code), 'nb')
      )
      .map((categoryUsage: ICodeUsage) => (
        <Accordion.Item
          key={categoryUsage.code}
          open={openCategory === categoryUsage.code}
          onOpenChange={(open) => setOpenCategory(open ? categoryUsage.code : undefined)}
        >
          <Accordion.Header>
            <div className="flex w-full flex-col">
              <div className="min-w-0">
                {codelistUtils.getShortname(EListName.CATEGORY, categoryUsage.code)}
              </div>
              <div className="mt-1 text-sm opacity-60">
                Opplysningstyper: {categoryUsage.informationTypes.length}
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Content>
            <ul className="pl-0 pr-0">
              {categoryUsage.informationTypes
                .sort((a, b) => a.name.localeCompare(b.name, 'nb'))
                .map((informationType: IUse) => (
                  <li key={informationType.id} className="h-10 flex items-center">
                    <RouteLink href={`/informationtype/${informationType.id}`}>
                      {informationType.name}
                    </RouteLink>
                  </li>
                ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))
  }

  return (
    <>
      {categoryNotInUse && category && (
        <BodyLong spacing>
          <FontAwesomeIcon icon={faExclamationTriangle} color={theme.colors.negative400} />
          <div className="mr-1.5 inline" />
          {`Kategori ${codelistUtils.getShortname(EListName.CATEGORY, category)} er ikke i bruk`}
        </BodyLong>
      )}

      <div>
        <Heading level="2" size="medium" className="mt-5 mb-2">
          Kategorier
        </Heading>
        <Accordion>{panelList()}</Accordion>
      </div>
    </>
  )
}

export default ListCategoryInformationtype
