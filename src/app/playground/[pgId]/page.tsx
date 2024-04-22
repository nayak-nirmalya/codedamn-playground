import React from "react";

import { EditorComponent } from "@/components/editor";

export default function PlaygroundIdPage({
  params: { pgId },
}: {
  params: { pgId: string };
}) {
  console.log(pgId);

  return (
    <div>
      <EditorComponent />
    </div>
  );
}
