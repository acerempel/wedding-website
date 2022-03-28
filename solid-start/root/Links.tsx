import { useContext, JSXElement } from "solid-js";
import { Assets } from "solid-js/web";
import { StartContext } from "../entry-server/StartContext";
import { ContextMatches, RequestContext } from "../entry-server/StartServer";

function getAssetsFromManifest(
  manifest: RequestContext["manifest"],
  routerContext: RequestContext["routerContext"]
) {
  const path = mapRouteToFile(routerContext.matches[0]);
  const match = manifest[path] || [];

  const links = match.reduce((r, src) => {
    r[src.href] =
      src.type === "style" ? (
        <link rel="stylesheet" href={src.href} $ServerOnly />
      ) : (
        <link rel="modulepreload" href={src.href} $ServerOnly />
      );
    return r;
  }, {} as Record<string, JSXElement>);

  return Object.values(links);
}

function mapRouteToFile(matches: ContextMatches[]) {
  return matches
    .map(h =>
      h.originalPath.replace(/:(\w+)/, (f, g) => `[${g}]`).replace(/\*(\w+)/, (f, g) => `[...${g}]`)
    )
    .join("");
}

/**
 * Links are used to load assets for the server.
 * @returns {JSXElement}
 */
export default function Links(): JSXElement {
  const isDev = import.meta.env.MODE === "development";
  const context = useContext(StartContext);
  return (
    <Assets>{!isDev && getAssetsFromManifest(context.manifest, context.routerContext)}</Assets>
  );
}
