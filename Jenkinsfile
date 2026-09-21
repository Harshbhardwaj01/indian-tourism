pipeline {
    agent any

    environment {
        CI = 'true'
    }

    options {
        timestamps()
        skipDefaultCheckout(false)
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build frontend') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
        always {
            cleanWs()
        }
    }
}
