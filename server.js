const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;
const YAML_FILE_PATH = '/etc/transmission-rss.conf';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/add-text', (req, res) => {
    const { url, matcher, download_path } = req.body;

    if (url && matcher && download_path) {
        try {
            let yamlContent = fs.readFileSync(YAML_FILE_PATH, 'utf8');
            let doc = yaml.load(yamlContent);

            if (!Array.isArray(doc)) {
                return res.status(500).send('Formato YAML inválido');
            }

            // Encontrar a seção `feeds`
            let feedsSection = null;
            for (let i = 0; i < doc.length; i++) {
                if (doc[i].feeds) {
                    feedsSection = doc[i].feeds;
                    break;
                }
            }

            if (!feedsSection) {
                return res.status(500).send('Seção `feeds` não encontrada');
            }

            const newEntry = {
                url,
                regexp: [
                    {
                        matcher,
                        download_path
                    }
                ]
            };

            // Adicionar a nova entrada logo abaixo da seção `feeds`
            feedsSection.push(newEntry);

            const newYamlContent = yaml.dump(doc, { noRefs: true });
            fs.writeFileSync(YAML_FILE_PATH, newYamlContent, 'utf8');
            res.send('Texto adicionado com sucesso abaixo de - feeds:');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao escrever no arquivo');
        }
    } else {
        res.status(400).send('Dados incompletos fornecidos');
    }
});

app.post('/delete-text', (req, res) => {
    const { url } = req.body;

    if (url) {
        try {
            let yamlContent = fs.readFileSync(YAML_FILE_PATH, 'utf8');
            let doc = yaml.load(yamlContent);

            if (!Array.isArray(doc)) {
                return res.status(500).send('Formato YAML inválido');
            }

            // Encontrar a seção `feeds`
            let feedsSection = null;
            for (let i = 0; i < doc.length; i++) {
                if (doc[i].feeds) {
                    feedsSection = doc[i].feeds;
                    break;
                }
            }

            if (!feedsSection) {
                return res.status(500).send('Seção `feeds` não encontrada');
            }

            // Remover a entrada correspondente ao URL fornecido
            feedsSection = feedsSection.filter(entry => entry.url !== url);

            // Atualizar a seção `feeds`
            for (let i = 0; i < doc.length; i++) {
                if (doc[i].feeds) {
                    doc[i].feeds = feedsSection;
                    break;
                }
            }

            const newYamlContent = yaml.dump(doc, { noRefs: true });
            fs.writeFileSync(YAML_FILE_PATH, newYamlContent, 'utf8');
            res.send('Texto removido com sucesso');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao escrever no arquivo');
        }
    } else {
        res.status(400).send('URL não fornecido');
    }
});

app.get('/view-file', (req, res) => {
    fs.readFile(YAML_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler o arquivo');
        } else {
            res.send(data);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
