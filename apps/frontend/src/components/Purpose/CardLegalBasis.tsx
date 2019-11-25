import * as React from 'react';
import { Select, TYPE, Value } from 'baseui/select';
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input';
import { Label2 } from 'baseui/typography';
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button';
import { codelist, ListName } from "../../service/Codelist";
import { intl } from "../../util/intl/intl"

const rowBlockBrops: BlockProps = {
    display: 'flex',
    marginBottom: '1rem'
}

const CardLegalBasis = (props: any) => {
    const [gdpr, setGdpr] = React.useState<Value>([]);
    const [nationalLaw, setNationalLaw] = React.useState<Value>([]);
    const [description, setDescription] = React.useState("");
    const [error, setError] = React.useState()

    const { submit } = props

    const getValues = () => {
        if (gdpr.length < 1 && nationalLaw.length < 1 && description === "") {
            setError("Kunne ikke legge til. Fyll ut minst ett felt.")
            return null
        }
        return {
            gdpr: gdpr.length > 0 ? gdpr[0].id : null,
            nationalLaw: nationalLaw.length > 0 ? nationalLaw[0].id : null,
            description: description
        }
    }

    return (
        <Card>
            <Label2 marginBottom="1rem">{intl.legalBasisNew}</Label2>

            <Block {...rowBlockBrops} width="100%">
                <Select
                    options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
                    placeholder={intl.gdprSelect}
                    maxDropdownHeight="300px"
                    type={TYPE.search}
                    onChange={({ value }) => setGdpr(value)}
                    value={gdpr}
                />
            </Block>
            <Block {...rowBlockBrops}>
                <Select
                    options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
                    placeholder={intl.nationalLawSelect}
                    maxDropdownHeight="300px"
                    type={TYPE.search}
                    onChange={({ value }) => setNationalLaw(value)}
                    value={nationalLaw}
                />
            </Block>
            <Block {...rowBlockBrops}>
                <StatefulInput placeholder={intl.descriptionWrite} onChange={(event) => setDescription((event.target as HTMLInputElement).value)} />
            </Block>

            <Block width="100%" display="flex" justifyContent="space-between">
                <Button type='button' kind={KIND.secondary} size={ButtonSize.compact} onClick={() => submit(getValues())}>
                  {intl.legalBasisAdd}
                </Button>
                {error && <p>{error}</p>}
            </Block>
        </Card>


    )
}

export default CardLegalBasis