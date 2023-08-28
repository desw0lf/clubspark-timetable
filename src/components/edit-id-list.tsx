import { useState, useMemo, useId } from "react";
import { useIdList } from "@/providers/id-list-provider";
import { Pointer } from "./pointer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, TrashIcon, PlusCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { cn as classNames } from "@/lib/utils";
import { generateUid } from "@/utils/uid";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueries } from "react-query";
import venueBookingService from "../services/venue-booking.service";

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> { }

const Divider = () => <hr className="opacity-30 my-4" />;
const Loader: React.FC<LoaderProps> = ({ className }) => <span className={classNames("loader loader--sm", className)} />;
// type ErrorType = string;

// const IdListError: React.FC<{ name: string; errorTypes?: ErrorType[] }> = ({ name, errorTypes }) => {
//   if (!errorTypes || errorTypes.length === 0) {
//     return null;
//   }
//   const showError = (name: string, errorType: ErrorType) => {
//     const errors = {
//       required: `${name} is required`,
//       nodata: "No Data"
//     };
//     return errors[errorType] || "Unknown error";
//   }
//   return <div>{errorTypes.map((errorType) => showError(name, errorType))}</div>;
// }

interface EditIdListProps {
  setSheetOpen: (isOpen: boolean) => void;
}

const STALE_TIME = 10 * 60 * 1000; // 10m


export const EditIdList: React.FC<EditIdListProps> = ({ setSheetOpen }) => {
  const { idListRaw, setIdList } = useIdList();
  const [data, setData] = useState(idListRaw);
  const debouncedData = useDebounce(data, 1100);
  const validity = useQueries(
    debouncedData.map(({ id, uid, disabled }) => ({
      queryKey: ["validity", id, uid],
      queryFn: async () => venueBookingService.getSettings({ id }),
      retry: 0,
      enabled: !disabled && !!id,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // placeholderData: { id, uid },
      initialData: { id, uid },
      initialDataUpdatedAt: new Date().getTime() - STALE_TIME - 5000,
      staleTime: STALE_TIME,
      select: () => ({ id, uid })
    })),
  );
  // const validMap = useMemo(() => {
  //   return validity.reduce((acc, curr) => {
  //     console.log(curr.data);
  //     const d = curr.data || { uid: "-1" };
  //     return {
  //       ...acc,
  //       [d.uid]: curr
  //     };
  //   }, {})
  // }, [validity]);
  const onChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setData((prevState) => {
      const prev = prevState[index];
      const newItem = {
        ...prev,
        [name]: value
      };
      return prevState.map((item, i) => i === index ? newItem : item);
    });
  }
  const isSaveDisabled = useMemo(() => {
    const filtered = data.filter((a) => !a.disabled);
    if (filtered.length === 0) {
      return true;
    }
    if (data.some((a) => !a.id)) {
      return true;
    }
    if (validity.some((a) => a.isError)) {
      return true;
    }
    // if (Object.values(validList).some((a) => a === "INVALID" || a === "LOADING")) {
    //   return true;
    // }
    return false;
  }, [data, validity]);
  const onCheckedChange = (index: number) => () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange(index)({ target: { value: !data[index].disabled, name: "disabled" } } as any);
  }
  const onDelete = (index: number) => () => setData((prevState) => prevState.filter((_, i) => i !== index));
  const onAdd = (e?: React.MouseEvent<HTMLButtonElement>) => {
    !!e && e.preventDefault();
    setData((prevState) => [...prevState, { id: "", friendlyName: "", uid: generateUid() }]);
  }
  const checkDataValidity = () => {
    const filteredData = data.filter((item) => !!item.id);
    function checkIfValid() {
      if (isSaveDisabled) {
        return false;
      }
      // if (validity.some((a) => a.isError)) {
      //   return false;
      // }
      if (debouncedData.some((deb, i) => deb.id !== data[i]?.id)) {
        return false;
      }
      return true;
    }
    return {
      isValid: checkIfValid(),
      payload: filteredData
    };
  }
  const submitForm = (e?: React.MouseEvent<HTMLButtonElement>): void => {
    !!e && e.preventDefault();
    const { isValid, payload } = checkDataValidity();
    if (!isValid) {
      console.error("Can't save, not valid");
      return;
    }
    setIdList(payload);
    setSheetOpen(false);
  }
  return (
    <>
      <div className="flex-1 overflow-x-hidden overflow-auto pr-3 pl-1 -ml-1" data-gutter="stable">
        {data.map((item, i) => {
          // const v = validMap[item.uid] || { status: "" };
          const v = validity[i] || { status: "", data: {} };
          const isLoading = v.data!.id !== item.id || v.isFetching;
          return <div className={classNames("mt-4 flex gap-4 flex-col", { "opacity-30": item.disabled })} key={i}>
            <div className="grid gap-2">
              <div className="flex items-center justify-between space-x-2">
                <Label className="leading-snug" htmlFor={`id${i}`}>Venue ID <span className="text-red-500 bold inline-block scale-150">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className=""><DotsVerticalIcon /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={onCheckedChange(i)} className="cursor-pointer">
                      <div className="w-full inline-flex items-center justify-between">
                        <Label className="pointer-events-none" htmlFor={`disabled${i}`}>{item.disabled ? "Enable" : "Disable"}</Label>
                        <Switch className="scale-[0.6] origin-right" checked={!item.disabled} name="disabled" id={`disabled${i}`} />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete(i)} className="flex justify-between cursor-pointer text-red-500 focus:text-red-600">
                      <span>Delete</span><TrashIcon />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <Input disabled={item.disabled} className={classNames("pr-8", { "border-red-700": v.status === "error" })} onChange={onChange(i)} id={`id${i}`} name="id" type="text" value={item.id} autoComplete="off" />
                {(() => {
                  // if (!["error", "success"].includes(v.status)) {
                  if (item.id) {
                    if (isLoading) {
                      return <Loader className="absolute right-0 top-3 mr-3" />;
                    }
                    if (v.status === "success" && !item.disabled) {
                      return <CheckCircledIcon className="absolute right-0 top-3 mr-3 text-green-500" />;
                    }
                  }
                  return null;
                })()}
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="leading-snug" htmlFor={`friendlyName${i}`}>Label</Label>
              <div className="relative">
                <Input disabled={item.disabled} className="pl-8" onChange={onChange(i)} id={`friendlyName${i}`} name="friendlyName" type="text" placeholder={item.id} value={item.friendlyName} autoComplete="off" />
                <Pointer pointer={{ index: i }} className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 mt-px pointer-events-none" />
              </div>
            </div>
            <Divider />
          </div>;
        })}
        <div>
          <Button disabled={!data.at(-1)!.id} onClick={onAdd}><PlusCircledIcon className="mr-2" />Add venue</Button>
        </div>
      </div>
      <footer className="py-6 pr-6">
        <Button disabled={isSaveDisabled} onClick={submitForm} className="w-full">Save</Button>
      </footer>
    </>
  );
}