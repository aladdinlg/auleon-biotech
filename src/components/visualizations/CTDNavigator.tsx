'use client';

import { useState } from 'react';

interface CTDNode {
  id: string;
  label: string;
  labelEN?: string;
  status?: 'met' | 'partial' | 'missing';
  note?: string;
  children?: CTDNode[];
}

const CTD_TREE: CTDNode[] = [
  {
    id: 'part1', label: 'Part 1 行政管理资料', labelEN: 'Administrative', status: 'met',
    children: [
      { id: 'p1-1', label: '申请表 / 申请资质证明', status: 'met', note: '企业GMP证书有效期至2026年' },
      { id: 'p1-2', label: '授权书 / 代理协议', status: 'partial', note: '沙特/印尼出口授权书需更新' },
      { id: 'p1-3', label: '产品摘要 / 标签', status: 'met', note: '中英文双语标签已通过审评' },
    ],
  },
  {
    id: 'part2', label: 'Part 2 化学制造与控制 CMC', labelEN: 'CMC',
    children: [
      { id: 'p2-1', label: '原材料质量标准', status: 'met', note: 'pET28b载体及E.coli BL21(DE3)质量已验证' },
      { id: 'p2-2', label: '工艺描述 / 验证报告', status: 'met', note: '三批验证数据完整' },
      { id: 'p2-3', label: '分析方法学验证 (GL1/GL2)', status: 'met', note: 'ELISA效价、SDS-PAGE纯度、内毒素检测已验证' },
      { id: 'p2-4', label: '稳定性研究 (GL3)', status: 'partial', note: '已有24个月实时数据，36个月节点待更新' },
      { id: 'p2-5', label: '批次分析报告', status: 'met', note: '10批次数据一致性良好' },
    ],
  },
  {
    id: 'part3', label: 'Part 3 安全性研究', labelEN: 'Safety',
    children: [
      { id: 'p3-1', label: '靶动物安全性 TAS (GL41)', status: 'met', note: '绵羊5×剂量过量接种试验：无不良反应' },
      { id: 'p3-2', label: '实验室动物毒理', status: 'met', note: '小鼠/仓鼠急性毒理及致敏试验完成' },
      { id: 'p3-3', label: '环境风险评估', status: 'partial', note: '亚单位蛋白疫苗环境风险低，需补充生态毒理数据' },
      { id: 'p3-4', label: '人接触风险 / 职业安全', status: 'partial', note: '生产环节职业暴露评估数据待补充' },
    ],
  },
  {
    id: 'part4', label: 'Part 4 效力研究', labelEN: 'Efficacy',
    children: [
      { id: 'p4-1', label: '田间试验设计 / GCP报告', status: 'met', note: '新疆/甘肃两地田间试验GCP合规' },
      { id: 'p4-2', label: '攻毒保护试验', status: 'met', note: '绵羊CE攻毒保护率98%（含Bacterin工艺对比组）' },
      { id: 'p4-3', label: '血清学终点 / 抗体滴度', status: 'met', note: 'ELISA IgG ≥1:800；免疫持续期≥12个月' },
      { id: 'p4-4', label: 'TABST豁免申请 (GL50)', status: 'partial', note: '豁免方案已提交，等待SFDA审批意见' },
    ],
  },
];

const STATUS_CFG = {
  met: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', label: '已满足' },
  partial: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', label: '部分' },
  missing: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20', label: '缺失' },
};

function TreeNode({ node, depth = 0 }: { node: CTDNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const [selected, setSelected] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const cfg = node.status ? STATUS_CFG[node.status] : null;

  return (
    <div className={`${depth > 0 ? 'ml-5 border-l border-gray-200 pl-3 dark:border-slate-700' : ''}`}>
      <div
        className={`flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 transition-colors ${selected ? (cfg?.bg ?? 'bg-gray-50 dark:bg-slate-800') : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          if (!hasChildren) setSelected((s) => !s);
        }}
      >
        <span className="mt-1 flex-shrink-0 text-xs text-gray-400">
          {hasChildren ? (expanded ? '▼' : '▶') : '·'}
        </span>
        {cfg && <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${cfg.dot}`} />}
        <div className="min-w-0 flex-1">
          <span className={`text-sm font-medium ${depth === 0 ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'}`}>
            {node.label}
          </span>
          {node.labelEN && <span className="ml-1 text-xs text-gray-400">· {node.labelEN}</span>}
          {cfg && <span className={`ml-2 text-xs ${cfg.text}`}>{cfg.label}</span>}
          {selected && node.note && (
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">{node.note}</p>
          )}
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CTDNavigator() {
  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">CTD 注册资料导航器</h3>
        <p className="mt-0.5 text-xs text-gray-400">SFDA vNees 四部制 · 点击叶节点查看数据状态</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {CTD_TREE.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        {Object.entries(STATUS_CFG).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${v.dot}`} />
            <span className="text-gray-500 dark:text-slate-400">{v.label}</span>
          </div>
        ))}
        <span className="text-gray-400">· 点击父节点展开/折叠，点击叶节点查看备注</span>
      </div>
    </div>
  );
}
