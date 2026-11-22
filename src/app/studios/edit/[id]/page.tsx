import { Suspense } from "react";

import { FormSkeleton } from "@/components/shared/loading";
import { EditStudioForm } from "@/components/studios/edit-studio-form";

async function EditStudio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditStudioForm id={id} />;
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditStudio params={params} />
    </Suspense>
  );
}
