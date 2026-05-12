import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { useMeasurementVersionsQuery } from "../queries/useMeasurementVersionsQuery";
import { useMeasurementStructureQuery } from "../queries/useMeasurementStructureQuery";
import type { IServerElement } from "../../lib/transformStructure";

export interface VariantLookup {
  v1IdToPosKey: Map<string, string>;
  positionMap: Map<string, Map<string, IServerElement>>;
}

function buildVariantLookup(
  structureData: ReturnType<typeof useMeasurementStructureQuery>["data"],
): VariantLookup & { derivedVersions: string[] } {
  const v1IdToPosKey = new Map<string, string>();
  const positionMap = new Map<string, Map<string, IServerElement>>();
  const versionKeySet = new Set<string>();

  if (!structureData) return { v1IdToPosKey, positionMap, derivedVersions: ["v1"] };

  for (const screen of structureData.screens) {
    for (const row of screen.rows) {
      for (const element of row.elements) {
        const vk = element.version_key ?? "v1";
        versionKeySet.add(vk);
        const posKey = `${screen.screen_number}:${element.row_number}:${element.order_in_row}`;
        if (!positionMap.has(posKey)) positionMap.set(posKey, new Map());
        positionMap.get(posKey)!.set(vk, element);
        if (vk === "v1") {
          v1IdToPosKey.set(element.id, posKey);
        }
      }
    }
  }

  const derivedVersions = [...versionKeySet].sort();
  return { v1IdToPosKey, positionMap, derivedVersions };
}

export function useVersionSelector() {
  const { id: measurementId } = useParams<{ id: string }>();

  const panelVersionKey = useMeasurementBuilderStore((s) => s.panelVersionKey);
  const setPanelVersionKey = useMeasurementBuilderStore((s) => s.setPanelVersionKey);

  const { data: versionsData, isLoading: isLoadingVersions } =
    useMeasurementVersionsQuery(measurementId);
  const { data: structureData } = useMeasurementStructureQuery(measurementId);

  const lookup = useMemo(
    () => buildVariantLookup(structureData),
    [structureData],
  );

  const versions = useMemo(() => {
    if (versionsData && versionsData.length > 1) return versionsData;
    return lookup.derivedVersions.length > 0 ? lookup.derivedVersions : ["v1"];
  }, [versionsData, lookup.derivedVersions]);

  function getVariantForComponent(
    componentId: string,
    versionKey: string,
  ): IServerElement | undefined {
    const posKey = lookup.v1IdToPosKey.get(componentId);
    if (!posKey) return undefined;
    return lookup.positionMap.get(posKey)?.get(versionKey);
  }

  function getV1ElementForComponent(componentId: string): IServerElement | undefined {
    const posKey = lookup.v1IdToPosKey.get(componentId);
    if (!posKey) return undefined;
    return lookup.positionMap.get(posKey)?.get("v1");
  }

  function getVariantCountForComponent(componentId: string): number {
    const posKey = lookup.v1IdToPosKey.get(componentId);
    if (!posKey) return 0;
    const versionMap = lookup.positionMap.get(posKey);
    if (!versionMap) return 0;
    return Math.max(0, versionMap.size - 1);
  }

  return {
    panelVersionKey,
    setPanelVersionKey,
    versions,
    isLoadingVersions,
    getVariantForComponent,
    getV1ElementForComponent,
    getVariantCountForComponent,
  };
}
