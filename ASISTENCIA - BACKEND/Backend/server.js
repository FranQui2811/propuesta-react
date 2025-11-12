const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config(); 
const port = process.env.PORT || 5000;
const cors = require('cors');


const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db'); 

connectDB();


const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Reemplazar 3000 por el puerto de su frontend si es diferente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended : false }));


// Definición de Rutas
app.use('/api/userAdmin', require('./routes/userAdminRoutes'));


// Middleware de Manejo de Errores (debe ir al final de las rutas)
app.use(errorHandler);


// Inicio del servidor
app.listen(port, () => 
    console.log(`Server started on port ${port}`)
);