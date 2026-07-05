#!/usr/bin/env bash
# Deploy the static guest-guide site to one or both targets.
#
# Usage: ./deploy.sh <local|remote|both> [--dry-run]
#
#   local   -> /var/www/gp_projects/airbnb/         (this Pi, projects.gopure.shop/airbnb/)
#   remote  -> js_com:public_html/                   (Cloudways account root, via ssh alias "js_com")
#   both    -> both of the above
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_TARGET="/var/www/gp_projects/airbnb/"
REMOTE_TARGET="js_com:public_html/"

RSYNC_OPTS=(-avz --delete --exclude=deploy.sh)
if [[ "${2:-}" == "--dry-run" ]]; then
  RSYNC_OPTS+=(--dry-run)
  echo "(dry run — no files will actually be changed)"
fi

usage() {
  echo "Usage: $0 <local|remote|both> [--dry-run]"
  exit 1
}

[[ $# -ge 1 ]] || usage

deploy_local() {
  echo "==> Deploying to local: $LOCAL_TARGET"
  rsync "${RSYNC_OPTS[@]}" "$SCRIPT_DIR/" "$LOCAL_TARGET"
}

deploy_remote() {
  echo "==> Deploying to remote: $REMOTE_TARGET"
  rsync "${RSYNC_OPTS[@]}" -e ssh "$SCRIPT_DIR/" "$REMOTE_TARGET"
}

case "$1" in
  local)  deploy_local ;;
  remote) deploy_remote ;;
  both)   deploy_local; deploy_remote ;;
  *) usage ;;
esac

echo "Done."
