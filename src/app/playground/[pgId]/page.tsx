import React from "react";

export default function PlaygroundIdPage({
  params: { pgId },
}: {
  params: { pgId: string };
}) {
  console.log(pgId);

  return <div>PlaygroundIdPage</div>;
}
