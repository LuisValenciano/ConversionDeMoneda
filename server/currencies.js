const currencyAPIKEY = 'e99379912231947fc0ecc8de6ddb031f'
const consultaLink = 'http://api.exchangeratesapi.io/v1/latest?access_key=e99379912231947fc0ecc8de6ddb031f'
let rates = {}

const consultaPais = 'https://restcountries.com/v3.1/currency/'


function cargarMonedas() {
    fetch(consultaLink)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            rates = data.rates
            let currencies = Object.keys(data.rates);
            let combo1 = document.getElementById('comboCurrencies1');
            let combo2 = document.getElementById('comboCurrencies2');
            let opciones = [];

            const fetchPromises = currencies.map(currency => {
                return fetch(`${consultaPais}${currency}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la solicitud de país: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(countryData => {
                        let currencyName = countryData[0]?.currencies?.[currency]?.name || 'Nombre Desconocido';
                        opciones.push({
                            code: currency,
                            name: currencyName
                        });
                    })
                    .catch(error => {
                        console.error('Hubo un problema con la solicitud del nombre de la moneda:', error);
                    });
            });

            Promise.all(fetchPromises).then(() => {
                opciones.sort((a, b) => a.name.localeCompare(b.name));

                opciones.forEach(option => {
                    let optionElement1 = document.createElement('option');
                    optionElement1.value = option.code;
                    optionElement1.text = `${option.code} - ${option.name}`;
                    combo1.appendChild(optionElement1);

                    let optionElement2 = document.createElement('option');
                    optionElement2.value = option.code;
                    optionElement2.text = `${option.code} - ${option.name}`;
                    combo2.appendChild(optionElement2);
                });
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

function hacerConversion(){
    let currency1 = document.getElementById('comboCurrencies1').value;
    let currency2 = document.getElementById('comboCurrencies2').value;
    let monto = document.getElementById('inputCurrency').value;

    if (rates[currency1] && rates[currency2]){
        let montoEnEuros = monto / rates[currency1];
        let montoFinal = montoEnEuros * rates[currency2];

        document.getElementById('resultCurrency').value = montoFinal.toFixed(2);
    }else{
        alert('Una o ambas monedas no tienen una tasa de cambio disponible');
    }
}

document.getElementById('comboCurrencies1').addEventListener('change', hacerConversion)
document.getElementById('comboCurrencies2').addEventListener('change', hacerConversion)
document.getElementById('inputCurrency').addEventListener('input', hacerConversion)

cargarMonedas();
