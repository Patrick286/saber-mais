const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js', // Caminho para o seu arquivo de entrada principal
      title: 'Saber Mais' // Novo título desejado
    }
  }
});