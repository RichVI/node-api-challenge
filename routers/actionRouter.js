const express = require('express');
const actionHelper = require('../data/helpers/actionModel');
const router = express.Router();

// GET - All actions
router.get('/', (req, res) => {
    actionHelper
        .get()
        .then(actions => {
            if(actions.length) {
                res.status(200).json(actions);
            }
            else {
                res.status(404).json({message:"There are no actions found", actions});
            }
        })
        .catch(error => (res.status500).json({project: "Action information could not be retrieved.", error}));
});

// GET - Get action by action ID
router.get('/:id', validateActionID, (req, res) => {
    actionHelper
        .get(req.params.id)
        .then(actions => {
            if(actions) {
                res.status(200).json(actions);
            }
            else {
                res.status(404).json({message:"action not found", actions});
            }
        })
        .catch(error => (res.status(500).json({message: "action information could not be retrieved.", error})));
});

// POST - Post a new project by project ID
router.post('/', validateActionData,  (req, res) => {
    actionHelper
        .insert(req.body)
        .then((actions) => {
            res.status(201).json({ message: 'Action added', action: req.body });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Error adding the action, please go back to /api/projects/ to verify your project ID' });
        })
});

// PUT Update action by action ID
router.put('/:id', (req, res) => {
    actionHelper
        .update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(201).json({message: "Action sucessfully updated", project});
            }
            else {
                res.status(404).json({ message: "Unable to locate this action" });
            }
        })
        .catch(error => ({message: "Unable to updated this action", error}));
});

// Delete - Delete action by action ID
router.delete('/:id', (req, res) => {
    actionHelper
        .remove(req.params.id)
        .then(project => {
            res.status(202).json({message: "Action sucessfully deleted"});
        })
        .catch(error => ({message: "Unable to delete action", error}));
});

module.exports = router;




// Custom middleware

// Validate action ID
function validateActionID(req, res, next) {
    actionHelper
        .get(req.params.id)
        .then(actionID => {
            if(actionID) {
                req.actionID = actionID;
            } 
            else {
                res.status(400).json({ message: "invalid action ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Action ID does exist" });
          });
    next();
  }

  // Validate action data  
function validateActionData(req, res, next) {
    if (!req.body.project_id) {
		res.status(400).json({ message: "Invalid project_id, please go back to /api/projects/ to verify your project ID" });
	}
	else if (!req.body.notes || !req.body.description) {
		res.status(400).json({ message: "Missing|Incorrect 'notes' or 'description' for this action" });
	}
    else {
        next();
    }
}
module.exports = router;