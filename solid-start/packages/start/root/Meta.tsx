import { useContext } from "solid-js";
import { Assets, ssr } from "solid-js/web";
import { renderTags } from "solid-meta";
import { StartContext } from "../server/StartContext";

export default function Meta() {
  const context = useContext(StartContext);
  // @ts-expect-error The ssr() types do not match the Assets child types
  return <Assets>{ssr(renderTags(context.tags))}</Assets>;
}
