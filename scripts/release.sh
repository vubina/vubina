#!/bin/bash

set -e

REPO_ROOT=$(pwd)

echo "📝 Copying README.md and LICENSE to all packages..."

for PKG in packages/*; do
  if [ -d "$PKG" ]; then
    cp "$REPO_ROOT/LICENSE" "$PKG/LICENSE"

    if [[ $PKG == "packages/insights" ]] ; then
        cp "$REPO_ROOT/README.md" "$PKG/README.md"
    fi

    echo "✅ Copied to $PKG"
  fi
done

echo "🚀 Publishing all packages with pnpm..."
pnpm -r publish --access public --no-git-checks
