import * as React from "react";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import {InformationType, InformationtypeFormValues} from "../constants"
import {Code, codelist} from "../service/Codelist";
import {intl} from "../util"
import {getInformationType, updateInformationType} from "../api"
import {RouteComponentProps} from "react-router-dom";
import {H4} from "baseui/typography";
import {StyledSpinnerNext} from "baseui/spinner"


const reduceCodelist = (list: Code[]) => {
  if (!list) return;
  return list.reduce((acc: Array<string | null>, curr: Code) => {
    return [...acc, !curr ? null : curr.code];
  }, []);
};

const initFormValues = (data: InformationType) => {
  return {
    id: data.id,
    name: data.name,
    term: data.term || undefined,
    sensitivity: !data.sensitivity ? '' : data.sensitivity.code,
    categories: reduceCodelist(data.categories),
    sources: reduceCodelist(data.sources),
    keywords: data.keywords,
    description: data.description || "",
    orgMaster: !data.orgMaster ? '' : data.orgMaster.code,
  } as InformationtypeFormValues;
};

const InformationtypeEditPage = (props: RouteComponentProps<{ id: string }>) => {
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorSubmit, setErrorSubmit] = React.useState(null);
  const [informationtype, setInformationType] = React.useState<InformationType>();

  const handleAxiosError = (error: any) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleSubmit = async (values: InformationtypeFormValues) => {
    if (!values) return
    setErrorSubmit(null)
    let body = {...values}

    try {
      await updateInformationType(body)
      props.history.push(`/informationtype/${props.match.params.id}`)
    } catch (e) {
      setErrorSubmit(e.message)
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const infoType = await getInformationType(props.match.params.id)
        setInformationType(infoType)
      } catch (e) {
        handleAxiosError(e)
      }
      await codelist.wait();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      {isLoading ? (
        <StyledSpinnerNext size={30}/>
      ) : (
        <React.Fragment>
          <H4>{intl.edit}</H4>

          {!error && informationtype ? (
            <React.Fragment>
              <InformationtypeForm
                formInitialValues={initFormValues(
                  informationtype
                )}
                isEdit
                submit={handleSubmit}
              />
              {errorSubmit && <p>{errorSubmit}</p>}
            </React.Fragment>
          ) : (
            <p>{intl.couldntLoad}</p>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default InformationtypeEditPage;
