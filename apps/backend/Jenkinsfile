def gitCommit
def scriptDir="/var/lib/jenkins/scripts"
def repoName="data-catalog-backend"
def repoBranch="master"
def organization="navikt"
def appId="26100" // Defined in the GitHub App "datajegerne"
def checkedOutLibraryScriptsRoot = "/var/lib/jenkins/jenkins-datajegerne-pipeline/"
//
// =============================================================================
// Set when explicitly loading groovy snippets from SCM:
//
def dockerUtilsScript
def naisScript
def slackScript
def versionScript
//
// =============================================================================
//
def checkOutLibrary(final String scriptDir, final String organization, final String repoName, final String repoBranch, final String libraryName, final String appId) {
	def checkedOutLibraryScriptRoot =
		sh (
		   script      : scriptDir + '/pull-shared-pipeline-scripts-repo-using-GitHub-App.sh \'' + organization + '\' \'' + repoName + '\' \'' + repoBranch + '\' \'' + appId + '\' \'' + libraryName + '\'',
		   returnStdout: true
		).trim()
	return checkedOutLibraryScriptRoot;
}

def loadLibraryScript(final String checkedOutLibraryScriptRoot, final String libraryScriptName) {
	return load(checkedOutLibraryScriptRoot + '/vars/' + libraryScriptName + '.groovy')
}

pipeline {
    agent any

    tools {
        maven "maven3"
        jdk "java8"
    }

    stages {
        stage("Checkout application") {
            cleanWs()
            script {
               gitCommit = sh (
                   script      : scriptDir + '/pull-app-repo-using-GitHub-App.sh \'' + organization + '\' \'' + repoName + '\' \'' + repoBranch + '\' \'' + appId + '\'',
                   returnStdout: true
               ).trim()
            }
        }
        stage("Load libraries") {
            script {
                echo "About to load libraries..."
                dockerUtilsScript = loadLibraryScript(checkedOutLibraryScriptRoot, 'dockerUtils')
                naisScript        = loadLibraryScript(checkedOutLibraryScriptRoot, 'nais'       )
                slackScript       = loadLibraryScript(checkedOutLibraryScriptRoot, 'slack'      )
                versionScript     = loadLibraryScript(checkedOutLibraryScriptRoot, 'version'    )
            }
        }
    }
}