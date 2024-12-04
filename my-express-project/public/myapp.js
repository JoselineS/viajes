document.getElementById('preferences-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const destination = document.getElementById('destination').value;
    const accommodation = document.getElementById('accommodation').value;
    const activities = document.getElementById('activities').value;
    const budget = document.getElementById('budget').value;

    if (!destination || !accommodation || !activities || !budget) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<p>Cargando recomendaciones...</p>';

    fetch(`http://localhost:3005/recommendations?destination=${destination}&accommodation=${accommodation}&activities=${activities}&budget=${budget}`)
        .then(response => response.json())
        .then(data => {
            recommendationsDiv.innerHTML = '';

            if (data.error) {
                recommendationsDiv.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            if (data.length === 0) {
                recommendationsDiv.innerHTML = '<p>No se encontraron recomendaciones.</p>';
            } else {
                data.forEach(recommendation => {
                    const div = document.createElement('div');
                    div.classList.add('recommendation');
                    div.innerHTML = `
                        <h3>${recommendation.name}</h3>
                        <p><strong>Descripción:</strong> ${recommendation.description}</p>
                        <p><strong>Destino:</strong> ${recommendation.destination}</p>
                        <p><strong>Alojamiento:</strong> ${recommendation.accommodation}</p>
                        <p><strong>Actividades:</strong> ${recommendation.activities}</p>
                        <p><strong>Presupuesto:</strong> ${recommendation.budget}</p>
                        <img src="${recommendation.imageURL}" alt="${recommendation.name}" style="width: 100%; height: auto; border-radius: 8px; margin-top: 10px;">
                    `;
                    recommendationsDiv.appendChild(div);
                });
            }
        })
        .catch(error => {
            recommendationsDiv.innerHTML = '<p>Error al obtener las recomendaciones.</p>';
            console.error(error);
        });
});