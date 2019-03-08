@Library('nais')
@Library('deploy')
import deploy
import com.jenkinsci.plugins.badge.action.BadgeAction
deployLib = new deploy()
node {
    def appToken
    def commitHash
    def appConfig = "nais.yaml"
    def dockerRepo = "repo.adeo.no:5443"
    def application = "data-catalog-backend"
    def mvnHome = tool "maven-3.3.9"
    def jdk = tool "11"
    def mvn = "${mvnHome}/bin/mvn"
    def FASIT_ENV = "t5"
    try {
        cleanWs()

        stage("checkout") {
            appToken = github.generateAppToken()
            sh "git init"
            sh "git pull https://x-access-token:$appToken@github.com/navikt/data-catalog-backend.git"
            sh "git fetch --tags https://x-access-token:$appToken@github.com/navikt/data-catalog-backend.git"
            releaseVersion = sh(script: "git describe --always --abbrev=0 --tags", returnStdout:true).trim()
            committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
            sh "mvn clean install"
        }
        stage("build and publish docker image") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "docker build -t ${dockerRepo}/${application}:${releaseVersion} ."
                sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} ${dockerRepo} && docker push ${dockerRepo}/${application}:${releaseVersion}"
            }
        }
        stage("publish yaml") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
              sh "curl --user ${env.NEXUS_USERNAME}:${env.NEXUS_PASSWORD} --upload-file ${appConfig} https://repo.adeo.no/repository/raw/nais/${application}/${releaseVersion}/nais.yaml"
            }
        }
       stage('Deploy to nais preprod') {
            script {
                deployToPreprod(application, releaseVersion, "q1", "fss", "default", committer)
            }
       }
    } catch (err) {
        throw err
    }
}
def deployToPreprod(app, releaseVersion, environment, zone, namespace, committer) {
   callback = "${env.BUILD_URL}input/Deploy/"

   def deploy = deployLib.deployNaisApp(app, releaseVersion, environment, zone, namespace, callback, committer).key

   try {
       timeout(time: 15, unit: 'MINUTES') {
           input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
       }
       currentBuild.rawBuild.getActions().add(BadgeAction.createShortText("Preprod: ${releaseVersion}", 'black', '#b4d455', '1px', 'green'))
   }
   catch (Exception e) {
       color = 'warning'
       GString message = "Build ${releaseVersion} of ${app} could not be deployed to pre-prod"
       slackSend color: color, channel: '#team-tuan-ci', message: message, teamDomain: 'nav-it', tokenCredentialId: 'pam-slack'
       throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)
   }
}