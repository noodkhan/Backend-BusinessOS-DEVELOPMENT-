module.exports = {
    apps: [
        {
            name: "chain-api",
            script: "./index.js",
            instances: "max",
            exec_mode: "cluster",
            watch: true,
            env: {
                NODE_ENV: "development",
                PORT: "9999",
                MONGO_URI: "mongodb+srv://tossagun:1j60G3u5v4mJZ27h@db-nbadigitalservice-c204ed06.mongo.ondigitalocean.com/Account?authSource=admin&replicaSet=db-nbadigitalservice&tls=true",
                AWS_ACCESS_KEY_ID: "AKIAXYKJSNZECMN675FZ",
                AWS_SECRET_ACCESS_KEY: "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",
                AWS_REGION: "ap-southeast-2",
                AWS_BUCKET_NAME: "pcelemac",
                SALT: 12,
                JWT_SECRET: "chain&sec$platform",
                FRONTEND_URL: "http://167.172.71.71"
                // FRONTEND_URL: "http://localhost:5173"
            },
            env_production: {
                NODE_ENV: "production",
                PORT: "9999",
                MONGO_URI: "mongodb+srv://tossagun:1j60G3u5v4mJZ27h@db-nbadigitalservice-c204ed06.mongo.ondigitalocean.com/Account?authSource=admin&replicaSet=db-nbadigitalservice&tls=true",
                AWS_ACCESS_KEY_ID: "AKIAXYKJSNZECMN675FZ",
                AWS_SECRET_ACCESS_KEY: "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",
                AWS_REGION: "ap-southeast-2",
                AWS_BUCKET_NAME: "pcelemac",
                SALT: 12,
                JWT_SECRET: "chain&sec$platform",
                FRONTEND_URL: "http://167.172.71.71"
                // FRONTEND_URL: "http://localhost:5173"
            }
        }
    ],

    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy':
                'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
}
;