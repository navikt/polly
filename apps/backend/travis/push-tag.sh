#!/bin/bash -e
AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")"
GIT_USERNAME="$(git config user.name)"
PUSH_URL="https://x-access-token:$INSTALLATION_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
echo "brukernavn $GIT_USERNAME"
echo "Forfatter $AUTOR_NAME"
# If this is not a pull_request, the branch is master and its not tagged. Then create a new tag.
if [[ "${TRAVIS_PULL_REQUEST}" = "false" ]] && [[ "${TRAVIS_BRANCH}" = "master" ]] && [[ "${AUTHOR_NAME}" != "${GIT_USERNAME}" ]]; then
    git checkout master # switch to master branch (which is the same as the current commit), so we are not in DETACHED mode
    git tag 1.0_"$(date +%Y%m%d%H%M%S)"
    echo "$PUSH_URL"
    git push --tags ${PUSH_URL} HEAD:master >/dev/null 2>&1
    echo "Pushing the new version to $TRAVIS_REPO_SLUG as $GIT_USERNAME"
else
    echo "Will not bump version on branch ${TRAVIS_BRANCH} (Pull request: ${TRAVIS_PULL_REQUEST}, Tag: ${TRAVIS_TAG})"
fi