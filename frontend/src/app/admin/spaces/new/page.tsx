import { SpaceForm } from "@/components/admin/SpaceForm";
import { Reveal } from "@/components/ui/motion";

export default function NewSpacePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy-900">New Space</h1>
      </Reveal>
      <SpaceForm />
    </div>
  );
}
