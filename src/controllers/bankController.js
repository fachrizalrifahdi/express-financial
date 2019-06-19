import Bank from "../models/Bank"; //import report model
import jwt from "jsonwebtoken";

// Index report
const reportIndex = (req, res, next) => {
  Report.find()
    .populate("user", "role email userName firstName lastName")
    .select("_id issues information created_at")
    .exec()
    .then(reports => {
      res.status(200).send({
        data: reports,
        result_count: reports.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving reports."
      });
    });
};

// Create report
const reportCreate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Create a report
  const report = new Report({
    user: decoded.userId,
    issues: req.body.issues,
    information: req.body.information
  });

  // Save Report in the database
  report
    .save()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the report."
      });
    });
};

// Find Report only one data
const reportFindOne = (req, res, next) => {
  Report.findById(req.params.reportId)
    .populate("user", "role email userName firstName lastName")
    .select("_id issues information created_at")
    .exec()
    .then(report => {
      if (!report) {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      res.status(200).send(report);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      return res.status(500).send({
        message: "Error retrieving report with id " + req.params.reportId
      });
    });
};

// Update Report
const reportUpdate = (req, res, next) => {
  // Find report and update it with the request body
  Report.findByIdAndUpdate(
    req.params.reportId,
    {
      $set: req.body
    },
    {
      new: true
    }
  )
    .then(report => {
      if (!report) {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      res.status(200).send(report);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      return res.status(500).send({
        message: "Error updating report with id " + req.params.reportId
      });
    });
};

// Delete Report
const reportDelete = (req, res, next) => {
  Report.findByIdAndRemove(req.params.reportId)
    .then(report => {
      if (!report) {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      res.status(200).send({
        message: "report deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "report not found with id " + req.params.reportId
        });
      }
      return res.status(500).send({
        message: "Could not delete report with id " + req.params.reportId
      });
    });
};

// export all function
export default {
  reportIndex,
  reportCreate,
  reportFindOne,
  reportUpdate,
  reportDelete
};
