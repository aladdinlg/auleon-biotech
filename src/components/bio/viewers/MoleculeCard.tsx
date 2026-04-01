"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MolstarViewer } from "@/components/bio/viewers/MolstarViewer";
import type { MoleculeRecord } from "@/lib/types";

interface MoleculeCardProps {
  molecule: MoleculeRecord;
}

function categoryLabel(category: MoleculeRecord["category"]): string {
  switch (category) {
    case "amino_acid":
      return "氨基酸";
    case "nucleotide":
      return "核苷酸";
    case "sugar":
      return "糖类";
    case "lipid":
      return "脂质";
    default:
      return "化合物";
  }
}

export function MoleculeCard({ molecule }: MoleculeCardProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  const source = molecule.uniProtId
    ? { type: "uniprot" as const, accession: molecule.uniProtId }
    : molecule.pdbId
      ? { type: "pdb" as const, pdbId: molecule.pdbId }
      : molecule.pubchemCID
        ? { type: "pubchem" as const, cid: molecule.pubchemCID, residueName: molecule.name.slice(0, 3).toUpperCase() }
        : null;

  return (
    <Card className="overflow-hidden border-border/70 p-0">
      <div className="border-b border-border/70 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {molecule.nameCn} <span className="text-sm text-muted-foreground">{molecule.name}</span>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              分子式 {molecule.formula} · 分子量 {molecule.molecularWeight}
            </p>
          </div>
          <Badge className="bg-emerald-400/15 text-emerald-300">{categoryLabel(molecule.category)}</Badge>
        </div>
      </div>

      <div className="p-5">
        {expanded ? (
          source ? (
            <MolstarViewer source={source} height={380} />
          ) : (
            <div className="flex h-[380px] items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/30 p-6 text-sm text-muted-foreground">
              当前分子仅提供元数据说明，暂未绑定 3D 结构源。
            </div>
          )
        ) : (
          <div className="flex h-[200px] flex-col justify-between rounded-3xl border border-border/70 bg-muted/50 p-5 dark:bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.2),transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.95))]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>3D 结构预览</span>
              <span>{molecule.pubchemCID ? `CID ${molecule.pubchemCID}` : molecule.pdbId ?? molecule.uniProtId}</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">{molecule.formula}</p>
              <p className="text-sm leading-7 text-muted-foreground">
                点击展开后加载 Mol* 结构查看器，观察分子骨架与空间排布。
              </p>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm leading-7 text-foreground">{molecule.description}</p>

        {expanded ? (
          <div className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm leading-7 text-muted-foreground">
            <p className="font-medium text-foreground">药学相关性</p>
            <p className="mt-2">{molecule.drugRelevance}</p>
            {molecule.uniProtId ? <p className="mt-3">UniProt: {molecule.uniProtId}</p> : null}
            {molecule.pdbId ? <p className="mt-3">PDB: {molecule.pdbId}</p> : null}
            {molecule.pubchemCID ? <p className="mt-3">PubChem CID: {molecule.pubchemCID}</p> : null}
          </div>
        ) : null}

        <div className="mt-5 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "收起详情" : "展开结构与说明"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
