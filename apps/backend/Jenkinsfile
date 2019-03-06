@Library('nais') _
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
            sh "mvn clean install"
//            sh "make bump-version"

//            commitHash = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
//            github.commitStatus("pending", "navikt/data-catalog-backend", appToken, commitHash)
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
                def deployIssueId = nais.jiraDeploy(env.BUILD_URL, "t5", "t5", application, releaseVersion)
                nais action: 'waitForCallback'
            }
       }
    } catch (err) {
//        github.commitStatus("failure", "navikt/data-catalog-backend", appToken, commitHash)
        throw err
    }
}