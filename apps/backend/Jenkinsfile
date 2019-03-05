@Library('nais') _
node {
    def appToken
    def commitHash
    def dockerRepo = "repo.adeo.no:5443"
    def application = "data-catalog-backend"
    def mvnHome = tool "maven-3.3.9"
    def jdk = tool "11"
    def mvn = "${mvnHome}/bin/mvn"
    try {
        cleanWs()

        stage("checkout") {
            releaseVersion = "0.0.1"
            appToken = github.generateAppToken()

            sh "git init"
            sh "git pull https://x-access-token:$appToken@github.com/navikt/data-catalog-backend.git"
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
    } catch (err) {
//        github.commitStatus("failure", "navikt/data-catalog-backend", appToken, commitHash)
        throw err
    }
}