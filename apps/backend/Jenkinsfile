@Library('nais') _
def gitCommit
def scriptDir="/var/lib/jenkins/scripts"
def repoName="data-catalog-backend"
def repoBranch="master"
def organization="navikt"
def appId="26100" // Defined in the GitHub App "datajegerne"
def checkedOutLibraryScriptsRoot = "./../data-catalog-backend@libs/"
//
// =============================================================================
// Set when explicitly loading groovy snippets from SCM:
//
//def dockerUtilsScript
//def naisScript
//def slackScript
//def versionScript
//
// =============================================================================
//
pipeline {
    agent any

    tools {
        maven "maven-3.3.9"
        jdk "java11"
    }

    stages {
//        stage("Load libraries") {
//            steps {
//                script {
//					def checkedOutLibraryScriptRoot = checkOutLibrary(scriptDir, organization, 'jenkins-datajegerne-pipeline', 'master', 'pipeline-lib', appId)
//                    echo "About to load libraries..."
//                    dockerUtilsScript = loadLibraryScript(checkedOutLibraryScriptRoot, 'dockerUtils')
//                    naisScript        = loadLibraryScript(checkedOutLibraryScriptRoot, 'nais'       )
//                    slackScript       = loadLibraryScript(checkedOutLibraryScriptRoot, 'slack'      )
//                    versionScript     = loadLibraryScript(checkedOutLibraryScriptRoot, 'version'    )
//                }
//            }
//        }

        stage("Checkout application") {
            steps {
                script {
                   gitCommit = sh (
                       script      : scriptDir + '/pull.via.github.app/pull-app-repo-using-GitHub-App.sh \'' + organization + '\' \'' + repoName + '\' \'' + repoBranch + '\' \'' + appId + '\'',
                       returnStdout: true
                   ).trim()
                }
            }
        }
    }
}