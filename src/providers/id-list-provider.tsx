import { createContext, useContext, useState } from "react";
import { loadStorage, saveStorage } from "@/utils/localstorage";
import { DEFAULT_CLUBSPARK_ID_LIST } from "../consts";
import { generateUid } from "@/utils/uid";
// ? TYPES:
import { ClubSparkId } from "../consts";

type IdListProviderProps = {
  children: React.ReactNode;
  defaultList?: ClubSparkId[];
  storageKey?: string;
}

type IdListProviderState = {
  idList: ClubSparkId[];
  idListRaw: ClubSparkId[];
  setIdList: (idList: ClubSparkId[]) => void;
}



const initialState = {
  idList: DEFAULT_CLUBSPARK_ID_LIST,
  idListRaw: DEFAULT_CLUBSPARK_ID_LIST,
  setIdList: () => null,
};

const IdListProviderContext = createContext<IdListProviderState>(initialState);

export function IdListProvider({
  children,
  defaultList = DEFAULT_CLUBSPARK_ID_LIST,
  storageKey = "cst-id-list",
  ...props
}: IdListProviderProps) {
  const [idList, setIdList] = useState<ClubSparkId[]>(() => loadStorage<ClubSparkId[]>(storageKey, defaultList).filter(({ disabled }) => !disabled));
  const [idListRaw, setIdListRaw] = useState<ClubSparkId[]>(() => loadStorage<ClubSparkId[]>(storageKey, defaultList).map((a) => ({ ...a, uid: generateUid() })));

  const value = {
    idList,
    idListRaw,
    setIdList: (idList: ClubSparkId[]) => {
      saveStorage(storageKey, idList);
      setIdList(idList.filter(({ disabled }) => !disabled));
      setIdListRaw(idList);
    },
  }

  return (
    <IdListProviderContext.Provider {...props} value={value}>
      {children}
    </IdListProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useIdList = () => {
  const context = useContext(IdListProviderContext);

  if (context === undefined) {
    throw new Error("useIdList must be used within a IdListProvider");
  }

  return context;
}