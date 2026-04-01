import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { FormulaBlock } from '@/components/ui/FormulaBlock';
import { AnalogyBox } from '@/components/ui/AnalogyBox';
import type { PrincipleSection } from '@/lib/types/chapter';

interface PrincipleTabProps {
  sections: PrincipleSection[];
}

export function PrincipleTab({ sections }: PrincipleTabProps) {
  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="min-w-0 flex-1 space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <BilingualHeading
              zhText={section.headingZH}
              enText={section.headingEN}
              level="h2"
              className="mb-4"
            />

            {/* Prose content — split on double newlines into paragraphs */}
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {section.content.split('\n\n').map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;
                // Bold headers like **Title**
                if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
                  return <h3 key={i} className="mt-6 text-base font-semibold text-gray-900 dark:text-slate-100">{trimmed.slice(2, -2)}</h3>;
                }
                return (
                  <p key={i} className="mb-3 text-base leading-7 text-gray-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n- /g, '<br/>• ')
                        .replace(/^- /, '• ')
                    }}
                  />
                );
              })}
            </div>

            {/* Formulas */}
            {section.formulas.map((f, i) => (
              <FormulaBlock key={i} latex={f.latex} label={f.label} />
            ))}

            {/* Analogies */}
            {section.analogies.map((a, i) => (
              <AnalogyBox key={i} icon={a.icon}>
                {a.text ?? a.content}
              </AnalogyBox>
            ))}

            {/* Key points */}
            {section.keyPoints.length > 0 && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  🔑 核心要点 Key Points
                </p>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                      <span dangerouslySetInnerHTML={{
                        __html: point.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </article>

      {/* Desktop Table of Contents */}
      <aside className="hidden w-56 flex-shrink-0 xl:block">
        <div className="sticky top-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            本章目录
          </p>
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                {section.headingZH}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
