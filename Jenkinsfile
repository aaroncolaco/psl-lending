pipeline {
    agent { docker 'node:6.3' }
    stages {
        stage('install npm modules') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    sh 'npm install'
                }
            }
        }

        stage('build & test') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    sh 'npm test'
                }
            }
        }
    }

    post {
        always {
            echo 'One way or another, I have finished'
            deleteDir() /* clean up our workspace */
        }
        success {
            echo 'I succeeeded!'
            slackSend channel: '#ops-room',
                  color: 'good',
                  message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            slackSend channel: '#ops-room',
                color: 'danger',
                message: "The pipeline ${currentBuild.fullDisplayName} failed. ${env.BUILD_URL}"

            echo 'I failed :('
        }
        changed {
            echo 'Things were different before...'
        }
    }
}