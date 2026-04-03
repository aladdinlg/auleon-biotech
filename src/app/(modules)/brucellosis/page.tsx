import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m3-brucellosis.json';
import { MechanismTabContent } from '@/components/tabs/m3/MechanismTabContent';
import { RegulatoryTabContent } from '@/components/tabs/m3/RegulatoryTabContent';
import { MarketTabContent } from '@/components/tabs/m3/MarketTabContent';

export default function BrucellosiPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} regulatoryContent={<RegulatoryTabContent />} marketContent={<MarketTabContent />} />;
}
