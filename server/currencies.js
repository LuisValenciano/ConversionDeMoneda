const currencyAPIKEY = 'e99379912231947fc0ecc8de6ddb031f'
const consultaLink = 'http://api.exchangeratesapi.io/v1/latest?access_key=e99379912231947fc0ecc8de6ddb031f'

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
            const currencies = Object.keys(data.rates);
            const combo1 = document.getElementById('comboCurrencies1');
            const combo2 = document.getElementById('comboCurrencies2');
            const options = [];

            const fetchPromises = currencies.map(currency => {
                return fetch(`${consultaPais}${currency}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la solicitud de país: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(countryData => {
                        const currencyName = countryData[0]?.currencies?.[currency]?.name || 'Nombre Desconocido';
                        options.push({
                            code: currency,
                            name: currencyName
                        });
                    })
                    .catch(error => {
                        console.error('Hubo un problema con la solicitud del nombre de la moneda:', error);
                    });
            });

            Promise.all(fetchPromises).then(() => {
                options.sort((a, b) => a.name.localeCompare(b.name));

                options.forEach(option => {
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

cargarMonedas();