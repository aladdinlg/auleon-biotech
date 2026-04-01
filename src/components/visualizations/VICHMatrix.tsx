'use client';

import { useState } from 'react';

const GUIDELINES = [
  { id: 'GL1', label: 'GL1 · 效力检验', desc: '疫苗批次效力试验设计、统计方法及最低保护阈值' },
  { id: 'GL2', label: 'GL2 · 安全性', desc: '目标动物、实验室动物及环境安全性评估' },
  { id: 'GL3', label: 'GL3 · 稳定性(兽)', desc: '兽用生物制品稳定性研究要求' },
  { id: 'GL4', label: 'GL4 · 稳定性(化)', desc: '化学兽药稳定性研究要求' },
  { id: 'GL27', label: 'GL27 · 联合疫苗', desc: '联合制品相容性与效力评价' },
  { id: 'GL41', label: 'GL41 · TAS', desc: '靶动物安全性(Target Animal Safety)研究' },
  { id: 'GL50', label: 'GL50 · TABST豁免', desc: '靶动物批次安全试验豁免路径（3R原则）' },
  { id: 'GL59', label: 'GL59 · 免疫持续', desc: '免疫持续期评估与最短持续期要求' },
];

const PRODUCTS = [
  { id: 'eg95', label: 'EG95 亚单位疫苗' },
  { id: 'brucella', label: '布鲁氏菌疫苗' },
  { id: 'capripox', label: '山羊痘/LSD疫苗' },
];

type Status = 'met' | 'partial' | 'missing';

// Compliance matrix: [guideline][product] = status
const MATRIX: Record<string, Record<string, Status>> = {
  GL1:  { eg95: 'met', brucella: 'met', capripox: 'met' },
  GL2:  { eg95: 'met', brucella: 'partial', capripox: 'met' },
  GL3:  { eg95: 'met', brucella: 'partial', capripox: 'partial' },
  GL4:  { eg95: 'met', brucella: 'met', capripox: 'met' },
  GL27: { eg95: 'missing', brucella: 'missing', capripox: 'partial' },
  GL41: { eg95: 'met', brucella: 'partial', capripox: 'met' },
  GL50: { eg95: 'partial', brucella: 'missing', capripox: 'partial' },
  GL59: { eg95: 'met', brucella: 'partial', capripox: 'partial' },
};

const STATUS_NOTES: Record<string, Record<string, string>> = {
  GL1:  { eg95: '攻毒试验数据完整，统计方案符合要求', brucella: 'S2/A19/Rev.1均有田间数据', capripox: '泰国/印尼BSTS数据支持' },
  GL2:  { eg95: '目标动物（绵羊）及仓鼠毒理完整', brucella: '人接触风险数据待补充', capripox: '过量接种试验已完成' },
  GL3:  { eg95: '36个月实时稳定性数据已满足', brucella: '加速老化数据缺12个月节点', capripox: '仅18个月数据，需补充到36M' },
  GL4:  { eg95: '全部理化指标（pH/外观/效价）验证完成', brucella: '复溶稳定性已验证', capripox: '佐剂配方稳定性数据完整' },
  GL27: { eg95: '单一产品，无需联合评价', brucella: '与口蹄疫联合开发数据空缺', capripox: '与羊痘二联数据部分收集' },
  GL41: { eg95: '过量接种（5×剂量）未见不良反应', brucella: '高剂量安全性数据待确认', capripox: '牛用剂量调整（3×goat）已验证' },
  GL50: { eg95: '免疫原性替代检验方案已提交审评', brucella: '活疫苗豁免路径尚未建立', capripox: 'EUA批次已豁免，正式注册需补充' },
  GL59: { eg95: '免疫持续期≥12个月（24个月末仍有保护）', brucella: '免疫持续期随株型差异较大', capripox: '单次免疫持续保护≥18个月' },
};

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  met:     { label: '已满足', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  partial: { label: '部分', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  missing: { label: '缺失', bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

export function VICHMatrix() {
  const [selected, setSelected] = useState<{ gl: string; prod: string } | null>(null);

  const selNote = selected ? STATUS_NOTES[selected.gl]?.[selected.prod] : null;
  const selStatus = selected ? MATRIX[selected.gl]?.[selected.prod] : null;

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">VICH 合规状态热图</h3>
        <p className="mt-0.5 text-xs text-gray-400">VICH Guideline Compliance Heatmap · 点击单元格查看数据要求</p>
      </div>

      <div className="flex gap-4">
        {/* Heatmap table */}
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-slate-400">指南</th>
                {PRODUCTS.map((p) => (
                  <th key={p.id} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-slate-400">
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GUIDELINES.map((gl) => (
                <tr key={gl.id} className="border-t border-gray-100 dark:border-slate-700/50">
                  <td className="py-2 pr-3 text-xs font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
                    {gl.label}
                  </td>
                  {PRODUCTS.map((prod) => {
                    const status = MATRIX[gl.id]?.[prod.id] ?? 'missing';
                    const cfg = STATUS_CONFIG[status];
                    const isSelected = selected?.gl === gl.id && selected?.prod === prod.id;
                    return (
                      <td key={prod.id} className="px-2 py-1 text-center">
                        <button
                          onClick={() => setSelected(isSelected ? null : { gl: gl.id, prod: prod.id })}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${cfg.bg} ${cfg.text} ${
                            isSelected ? 'ring-2 ring-offset-1 ring-current' : 'hover:opacity-80'
                          }`}
                        >
                          <span className={`mr-1 inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && selStatus && (
        <div className={`rounded-xl border p-4 ${STATUS_CONFIG[selStatus].bg}`}>
          <p className={`mb-1 text-xs font-bold uppercase ${STATUS_CONFIG[selStatus].text}`}>
            {GUIDELINES.find((g) => g.id === selected.gl)?.label} · {PRODUCTS.find((p) => p.id === selected.prod)?.label}
          </p>
          <p className="mb-2 text-xs text-gray-600 dark:text-slate-400">
            {GUIDELINES.find((g) => g.id === selected.gl)?.desc}
          </p>
          <p className={`text-sm font-medium ${STATUS_CONFIG[selStatus].text}`}>{selNote}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${v.dot}`} />
            <span className="text-gray-500 dark:text-slate-400">{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
