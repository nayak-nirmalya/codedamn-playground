import path from "path";
import directoryTree from "directory-tree";

export async function GET(
  req: Request,
  { params: { playgroundId } }: { params: { playgroundId: string } }
) {
  const playGroundPath = path.resolve(
    `${process.env.ROOT_DIR}/playgrounds/${playgroundId}/code`
  );
  console.log(playGroundPath);
  const tree = directoryTree(playGroundPath);

  return Response.json(tree, { status: 200 });
}
