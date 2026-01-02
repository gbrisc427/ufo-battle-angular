const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json());

const dbConfig = {
    host: 'wd.etsisi.upm.es',     
    user: 'class',                  
    password: 'Class25_26',        
    database: 'marsbd',             
    port: 3306                      
};

const pool = mysql.createPool(dbConfig);


app.get('/records/:username', (req, res) => {
    const username = req.params.username;

    console.log(`Buscando récords para el usuario: ${username}`);

    const query = `SELECT user as username, punctuation, ufos, disposed_time as disposedTime, record_date as recordDate 
                   FROM record WHERE user = ? ORDER BY punctuation DESC limit 10`;

    pool.query(query, [username], (err, results) => {
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