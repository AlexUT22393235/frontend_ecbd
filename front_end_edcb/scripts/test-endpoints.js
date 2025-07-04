const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Función para probar un endpoint
async function testEndpoint(name, url) {
  try {
    console.log(`\n🧪 Probando: ${name}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url);
    
    console.log('✅ Éxito!');
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Error!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de endpoints...\n');
  
  const tests = [
    {
      name: 'Predicción de Adicción',
      url: `${BASE_URL}/api/grafica-adiccion/6/5`
    },
    {
      name: 'Predicción de Rendimiento Académico',
      url: `${BASE_URL}/api/prediccion-rendimiento/6/5`
    },
    {
      name: 'Predicción de Salud Mental',
      url: `${BASE_URL}/api/grafica-salud-mental/7/2`
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    results.push({ ...test, ...result });
  }
  
  // Resumen de resultados
  console.log('\n📊 Resumen de Pruebas:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Exitosas: ${successful}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📈 Tasa de éxito: ${((successful / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n🔍 Endpoints con problemas:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Pruebas completadas!');
}

// Ejecutar las pruebas
runTests().catch(console.error); 