const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Configuración de la conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const app = express();
const port = 3000;

// Modelo para el autor
const Author = mongoose.model('Author', {
    name: String,
});

// Modelo para el libro
const Book = mongoose.model('Book', {
    id: { type: Number, unique: true },
    title: String,
    chapters: Number,
    pages: Number,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
});

app.use(bodyParser.json());

// Endpoint para agregar un autor
app.post('/api/authors', async(req, res) => {
    try {
        const { name } = req.body;
        const author = new Author({ name });
        await author.save();
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el autor.' });
    }
});

// Endpoint para agregar un libro
app.post('/api/books', async(req, res) => {
    try {
        const { id, title, chapters, pages, authorId } = req.body;
        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Autor no encontrado.' });
        }

        const book = new Book({ id, title, chapters, pages, author });
        await book.save();
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el libro.' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});