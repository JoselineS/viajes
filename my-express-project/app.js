const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configuración de Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './viaje.sqlite',
});

// Modelo de datos
class TouristSite extends Model {}
TouristSite.init(
    {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        destination: { type: DataTypes.STRING, allowNull: false },
        accommodation: { type: DataTypes.STRING, allowNull: false },
        activities: { type: DataTypes.STRING, allowNull: false },
        budget: { type: DataTypes.STRING, allowNull: false },
        imageURL: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'TouristSite' }
);

// Sincronización y prellenado de datos
(async () => {
    await sequelize.sync({ force: true }); // Reinicia la base de datos cada vez
    await TouristSite.bulkCreate([
        {
            name: 'Resort Playa del Sol',
            description: 'Un resort de lujo frente a la playa.',
            destination: 'Playa',
            accommodation: 'Resort',
            activities: 'Buceo',
            budget: 'Lujo',
            imageURL: 'https://images.pexels.com/photos/29614950/pexels-photo-29614950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
            name: 'Cabañas Montaña Serena',
            description: 'Cabañas rústicas rodeadas de naturaleza.',
            destination: 'Montaña',
            accommodation: 'Cabaña',
            activities: 'Senderismo',
            budget: 'Medio',
            imageURL: 'https://images.pexels.com/photos/29614774/pexels-photo-29614774/free-photo-of-pueblo-pintoresco-de-montana-con-colinas-onduladas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
            name: 'Hostal en la Ciudad',
            description: 'Alojamiento asequible cerca de lugares históricos.',
            destination: 'Ciudad',
            accommodation: 'Hostal',
            activities: 'Visitas Culturales',
            budget: 'Bajo',
            imageURL: 'https://images.pexels.com/photos/5147364/pexels-photo-5147364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
            name: 'Safari en la Selva',
            description: 'Explora la selva con un guía experto.',
            destination: 'Selva',
            accommodation: 'Camping',
            activities: 'Safari',
            budget: 'Medio',
            imageURL: 'https://images.pexels.com/photos/29619938/pexels-photo-29619938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
            name: 'Estación de Esquí Alpina',
            description: 'Ideal para amantes de los deportes de invierno.',
            destination: 'Montaña',
            accommodation: 'Hotel',
            activities: 'Esquí',
            budget: 'Alto',
            imageURL: 'https://images.pexels.com/photos/3229916/pexels-photo-3229916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
    ]);
})();

// Opciones válidas
const validOptions = {
    destination: ['Playa', 'Montaña', 'Ciudad', 'Desierto', 'Selva'],
    accommodation: ['Hotel', 'Cabaña', 'Hostal', 'Camping', 'Resort'],
    activities: ['Senderismo', 'Buceo', 'Visitas Culturales', 'Safari', 'Esquí'],
    budget: ['Bajo', 'Medio', 'Alto', 'Lujo'],
};

// Ruta para obtener recomendaciones
app.get('/recommendations', async (req, res) => {
    const { destination, accommodation, activities, budget } = req.query;

    if (
        !validOptions.destination.includes(destination) ||
        !validOptions.accommodation.includes(accommodation) ||
        !validOptions.activities.includes(activities) ||
        !validOptions.budget.includes(budget)
    ) {
        return res.status(400).json({ error: 'Opciones no válidas. Por favor, revisa tus selecciones.' });
    }

    try {
        const recommendations = await TouristSite.findAll({
            where: { destination, accommodation, activities, budget },
        });

        if (recommendations.length === 0) {
            return res.json([]);
        }

        res.json(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Iniciar servidor
const PORT = 3005;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));