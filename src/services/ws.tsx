import { createContext, ReactElement, ReactNode, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { Certificate, CertificateList } from "../models/certificate";
import { Company, CompanyList } from "../models/company";
import { Contact, ContactList } from "../models/contact";
import { Department, DepartmentList } from "../models/department";
import { Education, EducationList, EducationShort } from "../models/education";
import { Kind, KindList } from "../models/kind";
import { Post, PostList } from "../models/post";
import { Practice, PracticeList, PracticeShort } from "../models/practice";
import { Rank, RankList } from "../models/rank";
import { Scope, ScopeList } from "../models/scope";
import { Siren, SirenList } from "../models/siren";
import { SirenType, SirenTypeList } from "../models/sirentype";
import { useAuthState } from "./auth";

export type SelectItem = {
  id: number;
  name: string;
};

export type Item =
  | undefined
  | Certificate
  | Company
  | Contact
  | Department
  | Education
  | Kind
  | Post
  | Practice
  | Rank
  | Scope
  | Siren
  | SirenType;

export type List =
  | CertificateList
  | CompanyList
  | ContactList
  | DepartmentList
  | EducationList
  | EducationShort
  | KindList
  | PostList
  | PracticeList
  | PracticeShort
  | RankList
  | ScopeList
  | SirenList
  | SirenTypeList;

type GetListResponse =
  | undefined
  | {
      command: "GetList";
      name: "CertificateList";
      object: { CertificateList: CertificateList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "CompanyList";
      object: { CompanyList: CompanyList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "CompanySelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "ContactList";
      object: { ContactList: ContactList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "ContactSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "DepartmentList";
      object: { DepartmentList: DepartmentList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "DepartmentSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "EducationList";
      object: { EducationList: EducationList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "EducationNear";
      object: { EducationShort: EducationShort[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "KindList";
      object: { KindList: KindList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "KindSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "PostGoSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "PostList";
      object: { PostList: PostList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "PostSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "PracticeList";
      object: { PracticeList: PracticeList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "PracticeNear";
      object: { PracticeShort: PracticeShort[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "RankList";
      object: { RankList: RankList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "RankSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "ScopeList";
      object: { ScopeList: ScopeList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "ScopeSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "SirenList";
      object: { SirenList: SirenList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "SirenTypeList";
      object: { SirenTypeList: SirenTypeList[] };
      error: string;
    }
  | {
      command: "GetList";
      name: "SirenTypeSelect";
      object: { SelectItem: SelectItem[] };
      error: string;
    };

type ModifyItemResponse =
  | {
      command: "InsertItem" | "UpdateItem" | "DeleteItem";
      name: "Certificate";
      error: string;
    }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Company"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Contact"; error: string }
  | {
      command: "InsertItem" | "UpdateItem" | "DeleteItem";
      name: "Department";
      error: string;
    }
  | {
      command: "InsertItem" | "UpdateItem" | "DeleteItem";
      name: "Education";
      error: string;
    }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Kind"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Post"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Practice"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Rank"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Scope"; error: string }
  | { command: "InsertItem" | "UpdateItem" | "DeleteItem"; name: "Siren"; error: string }
  | {
      command: "InsertItem" | "UpdateItem" | "DeleteItem";
      name: "SirenType";
      error: string;
    };

type GetItemResponse =
  | {
      command: "GetItem";
      name: "Certificate";
      object: { Certificate: Certificate };
      error: string;
    }
  | {
      command: "GetItem";
      name: "Company";
      object: { Company: Company };
      error: string;
    }
  | {
      command: "GetItem";
      name: "Contact";
      object: { Contact: Contact };
      error: string;
    }
  | {
      command: "GetItem";
      name: "Department";
      object: { Department: Department };
      error: string;
    }
  | {
      command: "GetItem";
      name: "Education";
      object: { Education: Education };
      error: string;
    }
  | { command: "GetItem"; name: "Kind"; object: { Kind: Kind }; error: string }
  | { command: "GetItem"; name: "Post"; object: { Post: Post }; error: string }
  | {
      command: "GetItem";
      name: "Practice";
      object: { Practice: Practice };
      error: string;
    }
  | { command: "GetItem"; name: "Rank"; object: { Rank: Rank }; error: string }
  | { command: "GetItem"; name: "Scope"; object: { Scope: Scope }; error: string }
  | { command: "GetItem"; name: "Siren"; object: { Siren: Siren }; error: string }
  | {
      command: "GetItem";
      name: "SirenType";
      object: { SirenType: SirenType };
      error: string;
    };

type Response = GetItemResponse | ModifyItemResponse | GetListResponse;

export const GetItem = (
  name: string,
  id: string,
  sendJsonMessage: SendJsonMessage
): void => {
  const { auth } = useAuthState();

  const NumberID = Number(id);
  if (NumberID !== 0) {
    sendJsonMessage(
      `{"command":{"GetItem":{"name":"${name}","id":${NumberID}}},"addon":"${auth.user.token}"}`
    );
  }
};

export const GetList = (
  name: string,
  sendJsonMessage: SendJsonMessage
): void => {
  const { auth } = useAuthState();

  sendJsonMessage(
    `{"command":{"GetList":"${name}"},"addon":"${auth.user.token}"}`
  );
};

// export const GetSelect = (
//   name: string,
//   sendJsonMessage: SendJsonMessage
// ): void => {
//   const { auth } = useAuthState();

//   sendJsonMessage(
//     `{"command":{"Get":{"List":"${name}"}},"addon":"${auth.user.token}"}`
//   );
// };

export const SetItem = (
  id: number,
  name: string,
  item: Item,
  sendJsonMessage: SendJsonMessage
): void => {
  const { auth } = useAuthState();

  sendJsonMessage(
    `{ "command": { "${
      id === 0 ? "InsertItem" : "UpdateItem"
    }": { "${name}": ${JSON.stringify(item)} } }, "addon": "${
      auth.user.token
    }" }`
  );
};

export const DelItem = (
  id: number,
  name: string,
  sendJsonMessage: SendJsonMessage
): void => {
  const { auth } = useAuthState();

  sendJsonMessage(
    `{"command":{"DeleteItem":{"name":"${name}","id":${id}}},"addon":"${auth.user.token}"}`
  );
};

type WsState = {
  selectItem?: SelectItem[];
  certificate?: Certificate;
  company?: Company;
  contact?: Contact;
  department?: Department;
  education?: Education;
  kind?: Kind;
  post?: Post;
  practice?: Practice;
  rank?: Rank;
  scope?: Scope;
  siren?: Siren;
  sirenType?: SirenType;
  certificateList?: CertificateList[];
  companyList?: CompanyList[];
  contactList?: ContactList[];
  departmentList?: DepartmentList[];
  educationList?: EducationList[];
  educationShort?: EducationShort[];
  kindList?: KindList[];
  postList?: PostList[];
  practiceList?: PracticeList[];
  practiceShort?: PracticeShort[];
  rankList?: RankList[];
  scopeList?: ScopeList[];
  sirenList?: SirenList[];
  sirenTypeList?: SirenTypeList[];
};

const initialWsState: WsState = {};

interface WsProviderProperties {
  children: ReactNode;
}

export const WsContext = createContext(initialWsState);

// export const SetWsContext = createContext(initialSetWsState);

export const WsProvider = (properties: WsProviderProperties): ReactElement => {
  const { children } = properties;

  //   const [selectItem, setSelectItem] = useState<SelectItem>();
  //   const [selectItemList, setSelectItemList] = useState<SelectItem[]>();
  //   const [certificate, setCertificate] = useState<Certificate>();
  //   const [company, setCompany] = useState<Company>();
  //   const [contact, setContact] = useState<Contact>();
  //   const [department, setDepartment] = useState<Department>();
  //   const [education, setEducation] = useState<Education>();
  //   const [kind, setKind] = useState<Kind>();
  //   const [post, setPost] = useState<Post>();
  //   const [practice, setPractice] = useState<Practice>();
  //   const [rank, setRank] = useState<Rank>();
  //   const [scope, setScope] = useState<Scope>();
  //   const [siren, setSiren] = useState<Siren>();
  //   const [sirenType, setSirenType] = useState<SirenType>();
  //   const [certificateList, setCertificateList] = useState<CertificateList>();
  //   const [companyList, setCompanyList] = useState<CompanyList>();
  //   const [contactList, setContactList] = useState<ContactList>();
  //   const [departmentList, setDepartmentList] = useState<DepartmentList>();
  //   const [educationList, setEducationList] = useState<EducationList>();
  //   const [educationShort, setEducationShort] = useState<EducationShort>();
  //   const [kindList, setKindList] = useState<KindList>();
  //   const [postList, setPostList] = useState<PostList>();
  //   const [practiceList, setPracticeList] = useState<PracticeList>();
  //   const [practiceShort, setPracticeShort] = useState<PracticeShort>();
  //   const [rankList, setRankList] = useState<RankList>();
  //   const [scopeList, setScopeList] = useState<ScopeList>();
  //   const [sirenList, setSirenList] = useState<SirenList>();
  //   const [sirenTypeList, setSirenTypeList] = useState<SirenTypeList>();

  const [state, setState] = useState<WsState>({});

  const [socketUrl, setSocketUrl] = useState("ws://127.0.0.1:8080");

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
  });

  useEffect(() => {
    const msg = lastJsonMessage as Response;
    if (msg?.command === "GetItem") {
        switch (msg.name) {
            case 'Certificate':
                setState({...state, certificate: msg.object.Certificate});
              break;
            case 'Company':
                setState({...state, company: msg.object.Company});
              break;
            case 'Contact':
                setState({...state, contact: msg.object.Contact});
              break;
            case 'Department':
                setState({...state, department: msg.object.Department});
              break;
            case 'Education':
                setState({...state, education: msg.object.Education});
              break;
            case 'Kind':
                setState({...state, kind: msg.object.Kind});
              break;
            case 'Post':
                setState({...state, post: msg.object.Post});
              break;
            case 'Practice':
                setState({...state, practice: msg.object.Practice});
              break;
            case 'Rank':
                setState({...state, rank: msg.object.Rank});
              break;
            case 'Scope':
                setState({...state, scope: msg.object.Scope});
              break;
            case 'Siren':
                setState({...state, siren: msg.object.Siren});
              break;
            case 'SirenType':
                setState({...state, sirenType: msg.object.SirenType});
              break;
        }
    } else if (msg?.command === "InsertItem" || msg?.command === "UpdateItem" || msg?.command === "DeleteItem") {

    } else if (msg?.command === "GetList") {
      switch (msg.name) {
        case 'CertificateList':
          setState({...state, certificateList: msg.object.CertificateList});
          break;
        case 'CompanyList':
          setState({...state, companyList: msg.object.CompanyList});
          break;
        case 'ContactList':
          setState({...state, contactList: msg.object.ContactList});
          break;
        case 'DepartmentList':
          setState({...state, departmentList: msg.object.DepartmentList});
          break;
        case 'EducationList':
          setState({...state, educationList: msg.object.EducationList});
          break;
        case 'EducationNear':
          setState({...state, educationShort: msg.object.EducationShort});
          break;
        case 'KindList':
          setState({...state, kindList: msg.object.KindList});
          break;
        case 'PostList':
          setState({...state, postList: msg.object.PostList});
          break;
        case 'PracticeList':
          setState({...state, practiceList: msg.object.PracticeList});
          break;
        case 'PracticeNear':
          setState({...state, practiceShort: msg.object.PracticeShort});
          break;
        case 'RankList':
          setState({...state, rankList: msg.object.RankList});
          break;
        case 'ScopeList':
          setState({...state, scopeList: msg.object.ScopeList});
          break;
        case 'SirenList':
          setState({...state, sirenList: msg.object.SirenList});
          break;
        case 'SirenTypeList':
          setState({...state, sirenTypeList: msg.object.SirenTypeList});
          break;
      }
    }
  }, [lastJsonMessage]);

  // const contentValues = useMemo(
  //   () => ({
  //     state,
  //     dispatch,
  //   }),
  //   [state, dispatch],
  // );

  return <WsContext.Provider value={state}>{children}</WsContext.Provider>;
};
