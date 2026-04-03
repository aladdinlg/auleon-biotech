import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m4-capripoxvirus.json';
import { MechanismTabContent } from '@/components/tabs/m4/MechanismTabContent';
import { RegulatoryTabContent } from '@/components/tabs/m4/RegulatoryTabContent';

export default function CapripoxvirusPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} regulatoryContent={<RegulatoryTabContent />} />;
}
