const util = require("util");
const path = require("path");
const fs = require("fs");
const tv4 = require("tv4");

const PARTICIPANTS_SCHEMA = require("../data/participant-schema.json");
const DATA_PATH = path.join(__dirname, "..", "data", "participants-data.json");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const handlers = {
  post: async (req, res) => {
    const newParticipant = req.body;
    console.log(newParticipant);

    try {
      const participantsDataString = await readFile(DATA_PATH, "utf-8");
      const participantsData = JSON.parse(participantsDataString);

      newParticipant.id = participantsData.nextId;
      participantsData.nextId++;

      const isValid = tv4.validate(newParticipant, PARTICIPANTS_SCHEMA);

      if (!isValid) {
        const error = tv4.error;
        console.error(error);

        res.status(400).json({
          error: {
            message: error.message,
            dataPath: error.dataPath,
          },
        });
        return;
      }
      console.log(11, newParticipant);
      participantsData.participants.push(newParticipant);

      const newParticipantDataString = JSON.stringify(
        participantsData,
        null,
        " "
      );

      await writeFile(DATA_PATH, newParticipantDataString);
      res.json(newParticipant);
    } catch (err) {
      console.log(err);
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      next(err);
    }
  },
  readAll: async (req, res) => {
    try {
      const participantsDataString = await readFile(DATA_PATH, "utf-8");
      const participantsData = JSON.parse(participantsDataString);

      res.json(participantsData.participants);
    } catch (err) {
      console.log(err);

      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      next(err);
    }
  },
  readOne: async (req, res) => {
    const idToUpdate = Number(req.params.id);
    try {
      const participantsDataString = await readFile(DATA_PATH, "utf-8");
      const participantsData = JSON.parse(participantsDataString);
      const selectedParticipant = participantsData.participants.find(
        (participant) => participant.id === idToUpdate
      );

      res.json(selectedParticipant);
    } catch (err) {
      console.log(err);

      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      next(err);
    }
  },
  update: async (req, res) => {
    const idToUpdate = Number(req.params.id);

    const newParticipant = req.body;
    newParticipant.id = idToUpdate;
    const isValid = tv4.validate(newParticipant, PARTICIPANTS_SCHEMA);

    if (!isValid) {
      const error = tv4.error;
      console.error(error);

      res.status(400).json({
        error: {
          message: error.message,
          dataPath: error.dataPath,
        },
      });
      return;
    }

    try {
      const participantsDataString = await readFile(DATA_PATH, "utf-8");
      const participantsData = JSON.parse(participantsDataString);

      const entryToUpdate = participantsData.participants.find(
        (participant) => participant.id === idToUpdate
      );

      if (entryToUpdate) {
        const indexOfParticipant = participantsData.participants.indexOf(
          entryToUpdate
        );
        participantsData.participants[indexOfParticipant] = newParticipant;

        const newParticipantDataString = JSON.stringify(
          participantsData,
          null,
          " "
        );

        await writeFile(DATA_PATH, newParticipantDataString);

        res.json(newParticipant);
      } else {
        res.json(`no entry with id ${idToUpdate}`);
      }
    } catch (err) {
      console.log(err);
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      next(err);
    }
  },
  delete: async (req, res) => {
    const idToDelete = Number(req.params.id);

    try {
      const participantsDataString = await readFile(DATA_PATH, "utf-8");
      const participantsData = JSON.parse(participantsDataString);

      const enrtyToDelete = participantsData.participants.find(
        (participant) => participant.id === idToDelete
      );

      if (enrtyToDelete) {
        participantsData.participants = participantsData.participants.filter(
          (participant) => participant.id !== enrtyToDelete.id
        );

        const newParticipantDataString = JSON.stringify(
          participantsData,
          null,
          " "
        );

        await writeFile(DATA_PATH, newParticipantDataString);

        res.json(enrtyToDelete);
      } else {
        res.json(`no entry with id ${idToDelete}`);
      }
    } catch (err) {
      console.log(err);
      if (err && err.code === "ENOENT") {
        res.satatus(404).end();
        return;
      }
      next(err);
    }
  },
};

module.exports = handlers;
