pipeline {
    agent any

    tools {
        nodejs 'Node 18' // or Maven/Gradle for Java apps
    }

    environment {
        IMAGE_NAME = 'ludo-game'
        IMAGE_TAG = "v${BUILD_NUMBER}"
        NEXUS_REPO = 'http://localhost:8081' // Update this
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Aditya-Firedrake/calculator-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to Nexus') {
            steps {
                withDockerRegistry([url: "http://${NEXUS_REPO}", credentialsId: 'nexus-docker-creds']) {
                    sh """
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Update GitOps K8s Manifest') {
            steps {
                script {
                    def deploymentFile = 'k8s/deployment.yaml'
                    def imageLine = "image: ${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "sed -i '/image:/c\\        ${imageLine}' ${deploymentFile}"

                    sh """
                        git config user.email "ci@ludo.dev"
                        git config user.name "jenkins-ci"
                        git add ${deploymentFile}
                        git commit -m 'Update image to ${IMAGE_TAG}'
                        git push origin main
                    """
                }
            }
        }
    }
}
