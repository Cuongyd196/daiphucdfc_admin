pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'CuongServer',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t daiphucdfcadmin ./CuongDev/daiphucdfcadminCI/ \
                                    && docker service rm daiphucdfc_admin || true \
                                    && docker stack deploy -c ./CuongDev/daiphucdfcadminCI/docker-compose-vm.yml daiphucdfc \
                                    && rm -rf ./CuongDev/daiphucdfcadminCIB \
                                    && mv ./CuongDev/daiphucdfcadminCI/ ./CuongDev/daiphucdfcadminCIB",
                                execTimeout: 1200000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './CuongDev/daiphucdfcadminCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, app/, server/, webpack/, public/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: true
                    )
                ])
            }
        }
    }
}