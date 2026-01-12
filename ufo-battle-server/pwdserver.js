const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 1194;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'wd.etsisi.upm.es',
    user: 'class',
    password: 'Class25_26',
    database: 'marsbd',
    port: 1194
};

const pool = mysql.createPool(dbConfig);


app.patch('/users/:username', (req, res) => {
    const username = req.params.username;
    const password = req.body['password'];


    const query = `UPDATE user SET password=md5('${password}') WHERE user = '${username}'`;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta a BD:', err);
            res.status(500).json({ error: 'Error al consultar la base de datos' });
            return;
        }
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(` Servidor ScoreServer corriendo en http://localhost:${port}`);
});