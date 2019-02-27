@Library('deploy')
import deploy

def deployLib = new deploy()

node {
    def commitHash, commitHashShort, commitUrl
    def repo = "navikt"
    def application = "data-catalog-backend"
    def committer, committerEmail, releaseVersion
    def mvnHome = tool "maven-3.3.9"
    def mvn = "${mvnHome}/bin/mvn"
    def groupId = "nais"
    def zone = 'fss'
    def namespace = 'default'

    stage("Checkout") {
        cleanWs()
        withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088']) {
            sh(script: "git clone https://github.com/${repo}/${application}.git .")
        }

        commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        commitUrl = "https://github.com/${repo}/${application}/commit/${commitHash}"
        committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
        committerEmail = sh(script: 'git log -1 --pretty=format:"%ae"', returnStdout: true).trim()

        releaseVersion = "${env.major_version}.${env.BUILD_NUMBER}-${commitHashShort}"
    }
}