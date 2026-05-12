import { createContext, useContext } from "react";
import type { IServerElement } from "../../lib/transformStructure";

export interface IVersionContext {
  panelVersionKey: string;
  globalPreviewVersion: string;
  getVariantForComponent: (componentId: string, versionKey: string) => IServerElement | undefined;
  getV1ElementForComponent: (componentId: string) => IServerElement | undefined;
  getVariantCountForComponent: (componentId: string) => number;
}

const defaultCtx: IVersionContext = {
  panelVersionKey: "v1",
  globalPreviewVersion: "v1",
  getVariantForComponent: () => undefined,
  getV1ElementForComponent: () => undefined,
  getVariantCountForComponent: () => 0,
};

export const VersionContext = createContext<IVersionContext>(defaultCtx);

export function useVersionContext(): IVersionContext {
  return useContext(VersionContext);
}
