import * as React from "react";
import { intl, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Block, BlockProps } from "baseui/block";
import { StatefulSelect } from "baseui/select";
import { user } from "../service/User";
import { useStyletron } from "styletron-react";
import { ListItem, ListItemLabel } from "baseui/list";
import RouteLink from "../components/common/RouteLink";
import { H4 } from "baseui/typography";
import { StyledSpinnerNext } from "baseui/spinner"

const rowBlockProps: BlockProps = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '3rem',
}

const ThirdPartySearchPage = (props: RouteComponentProps) => {
  const [css] = useStyletron();
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  useAwait(user.wait())
  useAwait(codelist.wait(), setIsLoading)

  const thirdPartyList = codelist.getCodes(ListName.THIRD_PARTY)

  const handleChangeThirdParty = async (thirdParty?: string) => {
    if (thirdParty) {
      props.history.push(`/thirdparty/${thirdParty}`)
    }
  }

  return (
    <React.Fragment>
      <H4>{intl.thirdParty}</H4>

      {isLoading && <StyledSpinnerNext/>}
      {!isLoading && (
        <Block {...rowBlockProps}>
          <StatefulSelect
            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
            placeholder={intl.disclosureSelect}
            maxDropdownHeight="350px"
            onChange={(event) => handleChangeThirdParty((event.option?.id) as string | undefined)}
          />
        </Block>
      )}

      {!!thirdPartyList.length && (
        <ul
          className={css({
            width: '375px',
            paddingLeft: 0,
            paddingRight: 0,
          })}
        >
          {thirdPartyList.map(thirdParty => (
            <ListItem key={thirdParty.code}>
              <ListItemLabel>
                <RouteLink href={`thirdparty/${thirdParty.code}`}>{thirdParty.shortName}</RouteLink>
              </ListItemLabel>
            </ListItem>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default ThirdPartySearchPage;
