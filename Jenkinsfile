pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Code checked out from GitHub'
            }
        }

        stage('Build') {
            steps {
                bat 'echo Building Study Planner project...'
                bat 'if not exist index.html exit /b 1'
                bat 'if not exist landing.html exit /b 1'
                bat 'if not exist signup.html exit /b 1'
            }
        }

        stage('Code Quality') {
            steps {
                bat 'echo Checking project files...'
                bat 'if not exist css exit /b 1'
            }
        }

        stage('Test') {
            steps {
                bat 'echo Running basic project checks...'
                bat 'if not exist Notes.html exit /b 1'
                bat 'if not exist task.html exit /b 1'
            }
        }

        stage('Package') {
            steps {
                bat 'powershell -Command "Compress-Archive -Path * -DestinationPath study-planner.zip -Force"'
                archiveArtifacts artifacts: 'study-planner.zip', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: all stages passed and the Study Planner project was packaged.'
        }
        failure {
            echo 'FAILURE: one stage failed. Open the red stage to see why.'
        }
    }
}