import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

// TODO show error
class CodelistService {
  lists: ICodelists | null = null;
  error: string | null = null;
  promise: Promise<any>;

  constructor() {
    this.promise = this.fetchData();
  }

  private fetchData = async () => {
    return axios
    .get(`${server_polly}/codelist`)
    .then(this.handleGetCodelistResponse)
    .catch(err => this.error = err.message);
  };

  handleGetCodelistResponse = (response: any) => {
    if (typeof response.data === "object" && response.data !== null) {
      this.lists = response.data;
    } else {
      this.error = response.data;
    }
  };

  getCodes(list: ListName): ICodelist {
    return (this.lists && this.lists[list]) as { [key: string]: string };
  }

  getDescription(list: ListName, name: string): string {
    return this.getCodes(list)[name] as string;
  }

  async wait() {
    await this.promise;
  }

  isLoaded() {
    return this.lists != null || this.error != null;
  }
}

export interface ICodelists {
  [codelistName: string]: ICodelist
}

export interface ICodelist {
  [code: string]: string
}

export enum ListName {
  PURPOSE = "PURPOSE",
  CATEGORY = "CATEGORY",
  SOURCE = "SOURCE",
  SENSITIVITY = "SENSITIVITY",
  NATIONAL_LAW = "NATIONAL_LAW",
  SUBJECT_CATEGORY = "SUBJECT_CATEGORY",
  GDPR_ARTICLE = "GDPR_ARTICLE",
  DEPARTMENT = "DEPARTMENT",
  SUB_DEPARTMENT = "SUB_DEPARTMENT",
  SYSTEM = "SYSTEM",
}

export const codelist = new CodelistService();


// new objects from /codelist

export interface AllCodelists {
  codelist: List
}

export interface List {
  [name: string]: Code[]
}

export interface Code {
  list: ListName;
  code: string;
  shortName: string;
  description: string;
}

// Example
let code: AllCodelists = {
  codelist: {
    "PURPOSE": [
      {
        list: ListName.PURPOSE,
        code: "ABC_CODE",
        shortName: "Abc Code",
        description: "The codes of abc"
      }
    ]
  }
}