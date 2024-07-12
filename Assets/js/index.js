document.addEventListener('DOMContentLoaded', datos);
const select = document.querySelector('#miSelect')
const btn = document.querySelector('.boton');
const clp = document.querySelector('#clp');
const resultado = document.querySelector('#resultado');
let html = ''
let chart = null;

async function datos() {
    let data
    try {
    const res = await fetch('https://mindicador.cl/api');

     data = await res.json();
    }catch(error) {
        const res2 = await fetch('mindicador.json');
        data = await res2.json();
        Swal.fire({
            title: "<strong>error en API</strong>",
            icon: "info",
            html: `
              cargando datos de un recurso  <b>offline</b>...

            `
          });
    }
   
    const indicadores = Object.keys(data).filter(key => key !== 'version' && key !== 'autor' && key !== 'fecha').map(key => ({
        codigo: data[key].codigo,
        valor: data[key].valor
    }));
    for(indicador of indicadores) {
        html += `<option value="${indicador.codigo}">${indicador.codigo}</option>`
    }
    select.innerHTML = html;
}

async function renderizarGrafico(){
    const selectedName = select.value;
   
    datos = await fetch(`https://mindicador.cl/api/${selectedName.toLowerCase()}`);
    const datas = await datos.json();
      
      const labels = datas.serie.slice(0,10).map((item) => {return item.fecha.substring(0, 10)});
   
      const valores = datas.serie.slice(0,10).map((item) => {return item.valor});
 


      const config = {
          type: 'line',
          data: {
          labels: labels,
          datasets: [
              {
                  label: selectedName,
                  backgroundColor: 'red',
                  data: valores
                  }]}
      };
  
        const chartDOM = document.getElementById("myChart");
        if (chart) {
            chart.destroy();  
        }
        chartDOM.style.backgroundColor = 'white';
        chart = new Chart(chartDOM, config);
}



    
async function calculoPesos() {

    const selectedName = select.value;
    let clps = clp.value ;
    console.log(clps)
    let datos;
    try {
        datos = await fetch(`https://mindicador.cl/api/${selectedName.toLowerCase()}`); 
        const datas = await datos.json();
        console.log(datas);
        console.log(datas.serie[0].valor);
        let valor = datas.serie[0].valor;
        let pesos = clps / valor;
        resultado.innerHTML =`<h2>Resultado: $${pesos.toFixed(2)}</h2>`;

        renderizarGrafico()
    } catch (error) {
        console.error('Error al obtener los datos:', error);

    }
}

btn.addEventListener('click', calculoPesos);