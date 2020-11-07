const express = require('express');

app.use(cors(corsOptions));

app.use(express.static('./dist/'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(process.env.PORT || 8080);