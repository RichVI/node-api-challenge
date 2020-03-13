const express = require('express');
const projectHelper = require('../data/helpers/projectModel');
const router = express.Router();

// GET - Get all projects
router.get('/', (req, res) => {
    projectHelper
        .get()
        .then(projects => {
            if(projects.length) {
                res.status(200).json(projects);
            }
            else {
                res.status(404).json({message:"There are no projects found", projects});
            }
        })
        .catch(error => (res.status500).json({project: "Project information could not be retrieved.", error}));
});

// GET - Get projects by project ID
router.get('/:id', validateProjectID, (req, res) => {
    projectHelper
        .get(req.params.id)
        .then(projects => {
            if(projects) {
                res.status(200).json(projects);
            }
            else {
                res.status(404).json({message:"Project not found", projects});
            }
        })
        .catch(error => (res.status(500).json({message: "Project information could not be retrieved.", error})));
});

//GET - Get all actions by project ID
router.get('/:id/actions', validateProjectID, (req, res) => {
    projectHelper
        .getProjectActions(req.params.id)
        .then(projects => {
            if(projects) {
                res.status(200).json(projects);
            }
            else {
                res.status(404).json({message:"Action not found", projects});
            }
        })
        .catch(error => (res.status(500).json({project: "Action information could not be retrieved.", error})));
});

// POST - Post a new project by project ID
router.post('/', validateProjectData, (req, res) => {
    if(!req.body) {
        res.status(400).json({ message: "Missing project data" })
    } 
    else{
    projectHelper
        .insert(req.body)
        .then(project => {
            res.status(201).json({message: "New project sucessfully added", project});
        })
        .catch(error => ({message: "Unable to add new project", error}));}
});

// PUT - Update project by project ID
router.put('/:id', validateProjectID, validateProjectData, (req, res) => {
    projectHelper
        .update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(201).json({message: "Project sucessfully updated", project});
            }
            else {
                res.status(404).json({ message: 'Unable to locate this project' });
            }
        })
        .catch(error => ({message: "Unable to updated this project", error}));
});

// Delete - Delete project by project ID
router.delete('/:id', validateProjectID, (req, res) => {
    projectHelper
        .remove(req.params.id)
        .then(project => {
            res.status(202).json({message: "Project sucessfully deleted"});
        })
        .catch(error => ({message: "Unable to delete project", error}));
});

module.exports = router;




// Custom middleware

// Validate project ID
function validateProjectID(req, res, next) {
    projectHelper
        .get(req.params.id)
        .then(projectID => {
            if(projectID) {
                req.projectID = projectID;
            } 
            else {
                res.status(400).json({ message: "invalid project ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Project ID does exist" });
          });
    next();
  }

// Validate project data  
function validateProjectData(req, res, next) {
    if(!req.body) {
        res.status(400).json({ message: "Missing project data" })
    } 
    else if((!req.body.name) || (!req.body.description)) {
        res.status(400).json({ message: "Missing|Incorrect required 'name' or 'description' field" })
    }
    else{
        next();
    }
}
module.exports = router;
  