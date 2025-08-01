pipeline {
  agent any

  tools {
    nodejs 'NodeJS 18'
    allure 'Allure'
  }

  environment {
    HOME = "${env.WORKSPACE}"
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/ninjahrm/Group4.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm ci'
        bat 'npm run install:browsers'
      }
    }
    stage('Clean Allure Results') {
     steps {
       bat 'rmdir /s /q allure-results' // Windows command to delete folder
       bat 'mkdir allure-results'       // Recreate folder to avoid errors
  }
}

    stage('Run Tests') {
      steps {
       bat 'npm run test'
      }
    }

    stage('Generate Allure Report') {
      steps {
        bat 'allure generate ./allure-results --clean -o ./allure-report'
      }
    }
  }
  post {
    always {
      allure([
        reportBuildPolicy: 'ALWAYS',
        includeProperties: false,
        jdk: '',
        results: [[path: 'allure-results']]
      ])
    }

    /* stage('Publish Report') {
      steps {
        publishHTML(target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Test Report'
        ])
      }
    } */
  }
}
