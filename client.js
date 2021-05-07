const net = require('net');

const client = net.createConnection({ port:9898}, () =>{
    console.log('CLIENT: Connexion au serveur.');
    client.write('CLIENT: je suis le client!');
    client.write('Je communique avec le serveur');
});

client.on('data', (data) =>{
    console.log(data.toString());
    client.end();
});

client.on('end', () =>{
    console.log('CLIENT: Deconnexion du serveur.');
});