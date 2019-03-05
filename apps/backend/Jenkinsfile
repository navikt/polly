@Library('nais') _
node {
    def appToken
    def commitHash
    try {
        cleanWs()

        stage("checkout") {
            appToken = github.generateAppToken()

            sh "git init"
            sh "git pull https://x-access-token:$appToken@github.com/navikt/data-catalog-backend.git"
            sh "make bump-version"

//            commitHash = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
//            github.commitStatus("pending", "navikt/data-catalog-backend", appToken, commitHash)
        }
    } catch (err) {
//        github.commitStatus("failure", "navikt/data-catalog-backend", appToken, commitHash)
        throw err
    }
}