import * as React from "react";
import {intl, useAwait} from "../util"
import {RouteComponentProps} from "react-router-dom";
import {codelist, ListName} from "../service/Codelist";
import {user} from "../service/User";
import {H4} from "baseui/typography";
import {StyledSpinnerNext} from "baseui/spinner"
import AlphabeticList from "../components/common/AlphabeticList";

const ThirdPartySearchPage = (props: RouteComponentProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  useAwait(user.wait())
  useAwait(codelist.wait(), setIsLoading)

  const thirdPartyList = codelist.getCodes(ListName.THIRD_PARTY)

  return (
    <React.Fragment>
      <H4>{intl.thirdParties}</H4>

      {isLoading && <StyledSpinnerNext/>}

      {!!thirdPartyList.length && (
        <AlphabeticList listName={ListName.THIRD_PARTY} baseUrl={"/thirdparty/"}/>
      )}
    </React.Fragment>
  );
};

export default ThirdPartySearchPage;
