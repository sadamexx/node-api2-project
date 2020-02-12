const express = require('express');

const Data = require('./db.js');

const router = express.Router();

//same as api/posts/
router.get('/', (req, res) => {
    Data.find(req.query)
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'The posts information could not be retrieved' });
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id

    Data.findById(id)
    .then(d => {
        if(d) {
            res.status(200).json(d);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({ message: "The post information could not be retrieved" });
    });
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id

    Data.findPostComments(id)
    .then(comment => {
        if(comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist"});
        }
    })
    .catch(error => {
        res.status(500).json({ message: "The comments information could not be retrieved." });
    });
});

router.post('/', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;

    if(title && contents) {
        Data.insert(req.body)
        .then(data => {        
            res.status(201).json(data)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "There was an error while saving the post to the database" }); 
        });     
        } else {
            res.status(400).json({ message: "Please provide title and contents for the post"});
        }
});

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = {...req.body, post_id: id };
    const text = req.body.text;

    if(!comment){
        res.send(404).json({ message: "The post with the specified ID does not exist "});
    } else if (!text) {
        res.send(400).json({ 
            message: " Please provide text for the comment"});
    } else {
        Data.insertComment(comment)
        .then(comments => {        
            res.status(201).json(comments);        
        })
        .catch(error => {
            res.send(500).json({ message: "There was an error while saving the comment to the database"});
        });
    };
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;
    const changes = req.body;

    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else if (!title && !contents){
        res.status(400).json({ message: "Please provide title and contents for the post"});
    } else {
        Data.update(id, changes)
        .then(change => {
            res.status(200).json(change);
        })
        .catch(error => {
            res.status(500).json({ message: "The post information could not be modified"});
        })
    }
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist"});
    } else {
        Data.remove(id)
        .then(post => {
            res.status(200).json(post);            
        })
        .catch(error => {
            res.status(500).json({ message: "The post could not be removed"})
        });
    }
});


















module.exports = router;