function transformRouteData({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          state.refs = new Set();
          state.routeData = [];
          state.done = false;
          state.useRouteDataImported = false;
          path.traverse(
            {
              ImportSpecifier: path => {
                if (path.node.imported.name === "useRouteData") {
                  state.useRouteDataImported = true;
                }
              },
              CallExpression(callPath, callState) {
                if (callPath.get("callee").isIdentifier({ name: "createRouteResource" })) {
                  let node = callPath.node;
                  callPath.replaceWith(
                    t.memberExpression(
                      t.callExpression(t.identifier("useRouteData"), []),
                      t.numericLiteral(callState.routeData.length),
                      true
                    )
                  );
                  callState.routeData.push(node);
                }
              }
            },
            state
          );

          if (state.routeData.length) {
            if (!state.useRouteDataImported) {
              path.unshiftContainer(
                "body",
                t.importDeclaration(
                  [t.importSpecifier(t.identifier("useRouteData"), t.identifier("useRouteData"))],
                  t.stringLiteral("solid-app-router")
                )
              );
            }
            path.unshiftContainer(
              "body",
              t.exportNamedDeclaration(
                t.functionDeclaration(
                  t.identifier("routeData"),
                  [],
                  t.blockStatement([
                    ...state.routeData.map((routeResource, index) =>
                      t.variableDeclaration("const", [
                        t.variableDeclarator(t.identifier("a" + index), routeResource)
                      ])
                    ),
                    t.returnStatement(
                      t.arrayExpression(
                        state.routeData.map((routeResource, index) => t.identifier("a" + index))
                      )
                    )
                  ])
                )
              )
            );
          }
        }
      }
    }
  };
}
export { transformRouteData as default };
