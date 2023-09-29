import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../index.ts";

export const useTypedSelector : TypedUseSelectorHook<RootState> = useSelector;