import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m2-eg95-vaccine.json';
import { MechanismTabContent } from '@/components/tabs/m2/MechanismTabContent';
import { RegulatoryTabContent } from '@/components/tabs/m2/RegulatoryTabContent';
import { MarketTabContent } from '@/components/tabs/m2/MarketTabContent';

export default function EG95VaccinePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} regulatoryContent={<RegulatoryTabContent />} marketContent={<MarketTabContent />} />;
}
