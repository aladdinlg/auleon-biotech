'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  labelZH?: string;
  data?: { sensitivity?: number; specificity?: number; note?: string };
  children?: TreeNode[];
}

const TREE_DATA: TreeNode = {
  name: 'Poxviridae',
  children: [
    {
      name: 'Capripoxvirus',
      labelZH: '山羊痘病毒属',
      children: [
        {
          name: 'LSDV',
          labelZH: '牛结节性皮肤病病毒',
          children: [
            {
              name: 'P32 (ORF074)',
              labelZH: 'P32诊断抗原',
              data: { sensitivity: 94, specificity: 96.6, note: '间接ELISA核心抗原，两种病毒血清学通用' },
            },
            {
              name: 'L1R (ORF060)',
              labelZH: 'L1R类似蛋白',
              data: { note: '肉豆蔻酰化蛋白，含6个半胱氨酸残基，参与病毒入侵，与GTPV/SPPV高度保守' },
            },
          ],
        },
        {
          name: 'GTPV',
          labelZH: '山羊痘病毒',
          data: { note: '对LSD提供完整跨保护（Cross-Protection），96-97%核苷酸同源性' },
        },
        {
          name: 'SPPV',
          labelZH: '绵羊痘病毒',
          data: { note: '对LSD跨保护不足，不推荐单独用于牛LSD防控' },
        },
      ],
    },
    { name: 'Orthopoxvirus', labelZH: '正痘病毒属' },
    { name: 'Avipoxvirus', labelZH: '禽痘病毒属' },
  ],
};

const COLOR_MAP: Record<string, string> = {
  LSDV: '#ef4444',
  GTPV: '#22c55e',
  SPPV: '#f59e0b',
  'P32 (ORF074)': '#3b82f6',
  'L1R (ORF060)': '#8b5cf6',
  Capripoxvirus: '#06b6d4',
};

export function CapripoxPhylogeny() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<TreeNode | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = 480, H = 380;
    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g').attr('transform', 'translate(0, 0)');

    const root = d3.hierarchy(TREE_DATA);
    const treeLayout = d3.tree<TreeNode>().size([H - 40, W - 120]);
    treeLayout(root);

    // Links
    g.selectAll('path.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const src = d.source as d3.HierarchyPointNode<TreeNode>;
        const tgt = d.target as d3.HierarchyPointNode<TreeNode>;
        const x0 = src.y + 30, y0 = src.x + 20;
        const x1 = tgt.y + 30, y1 = tgt.x + 20;
        const mx = (x0 + x1) / 2;
        return `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#374151')
      .attr('stroke-width', 1);

    // Nodes
    const node = g.selectAll('g.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${(d as d3.HierarchyPointNode<TreeNode>).y + 30},${(d as d3.HierarchyPointNode<TreeNode>).x + 20})`)
      .style('cursor', (d) => d.data.data ? 'pointer' : 'default')
      .on('click', (_, d) => {
        if (d.data.data) setSelected((prev) => prev?.name === d.data.name ? null : d.data);
      });

    node.append('circle')
      .attr('r', 6)
      .attr('fill', (d) => COLOR_MAP[d.data.name] ?? '#64748b')
      .attr('opacity', 0.85);

    node.append('text')
      .attr('dy', '0.35em')
      .attr('x', (d) => d.children ? -10 : 10)
      .attr('text-anchor', (d) => d.children ? 'end' : 'start')
      .attr('font-size', 9)
      .attr('fill', (d) => COLOR_MAP[d.data.name] ?? '#94a3b8')
      .attr('font-weight', (d) => d.data.data ? 'bold' : 'normal')
      .text((d) => d.data.labelZH ?? d.data.name);

    node.append('text')
      .attr('dy', '1.5em')
      .attr('x', (d) => d.children ? -10 : 10)
      .attr('text-anchor', (d) => d.children ? 'end' : 'start')
      .attr('font-size', 7)
      .attr('fill', '#6b7280')
      .text((d) => d.depth > 0 && !d.children ? d.data.name : '');
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">Capripoxvirus 系统发育树</h3>
        <p className="mt-0.5 text-xs text-gray-400">Capripox Phylogenetic Tree · 点击蓝色/紫色节点查看抗原数据</p>
      </div>

      <svg ref={svgRef} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900" style={{ minHeight: 300 }} />

      {selected && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <p className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">{selected.name} · {selected.labelZH}</p>
          {selected.data?.sensitivity !== undefined && (
            <div className="mb-2 flex gap-4 text-xs">
              <span className="text-gray-600 dark:text-slate-400">灵敏度 Sensitivity: <strong className="text-emerald-600">{selected.data.sensitivity}%</strong></span>
              <span className="text-gray-600 dark:text-slate-400">特异度 Specificity: <strong className="text-blue-600">{selected.data.specificity}%</strong></span>
            </div>
          )}
          {selected.data?.note && (
            <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">{selected.data.note}</p>
          )}
        </div>
      )}

      <div className="rounded-xl bg-orange-50 p-3 text-xs leading-5 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300">
        LSDV / GTPV / SPPV 三者核苷酸同源性 96-97%。山羊痘（GTPV）疫苗可对LSD提供完整跨保护；
        绵羊痘（SPPV）跨保护不足。P32（ORF074）是两种病毒通用血清学诊断抗原。
      </div>
    </div>
  );
}
