import * as React from 'react'
import { Block, BlockProps } from 'baseui/block';
import { Label2 } from 'baseui/typography';
import { InformationType } from '../../constants';
import { ListItem, ListItemLabel } from 'baseui/list';
import RouteLink from '../common/RouteLink';
import { useStyletron } from 'styletron-react';
import { intl } from '../../util';
import { Sensitivity } from "../InformationType/Sensitivity"

const labelBlockProps: BlockProps = {
    marginBottom: '1rem',
    font: 'font400'
}

type ListRecievedInformationTypesProps = {
    informationtypeList: InformationType[];
}

const ListRecievedInformationTypes = ({ informationtypeList }: ListRecievedInformationTypesProps) => {
    const [css] = useStyletron();

    return (
        <Block>
            <Label2 {...labelBlockProps}>{intl.retrievedFromThirdParty}</Label2>
            <ul
                className={css({
                    width: '400px',
                    paddingLeft: 0,
                    paddingRight: 0,
                })}
            >
                {informationtypeList.map(infotype => (
                    <ListItem sublist key={infotype.id}>
                        <ListItemLabel sublist>
                            <RouteLink href={`/informationtype/${infotype.id}`}>
                              <Sensitivity sensitivity={infotype.sensitivity}/> {infotype.name}
                            </RouteLink>
                        </ListItemLabel>
                    </ListItem>
                ))}
            </ul>
          {!informationtypeList.length && <Label2 margin="1rem">{intl.emptyTable} {intl.informationTypes}</Label2>}
        </Block>
    )
}

export default ListRecievedInformationTypes
