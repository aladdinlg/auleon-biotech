import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m2-eg95-vaccine.json';
import { MechanismTabContent } from '@/components/tabs/m2/MechanismTabContent';

export default function EG95VaccinePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} />;
}
