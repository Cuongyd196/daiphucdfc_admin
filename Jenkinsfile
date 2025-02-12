pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
                telegramSend(message: 'Building job: $PROJECT_NAME ... - Link: $BUILD_URL', chatId: -721410839)
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/pktunganhweb ./thinklabsdev/pktunganhwebCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/pktunganhweb \
                                    && docker service rm pktunganh_web || true \
                                    && docker stack deploy -c ./thinklabsdev/pktunganhwebCI/docker-compose.yml pktunganh \
                                    && rm -rf ./thinklabsdev/pktunganhwebCIB \
                                    && mv ./thinklabsdev/pktunganhwebCI/ ./thinklabsdev/pktunganhwebCIB",
                                execTimeout: 600000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/pktunganhwebCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, app/, server/, webpack/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
                telegramSend(message: 'Build - $PROJECT_NAME – # $BUILD_NUMBER – STATUS: $BUILD_STATUS!', chatId: -721410839)
            }
        }
    }
}
