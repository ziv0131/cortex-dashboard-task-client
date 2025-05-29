import functions from 'firebase-functions/v2/https';
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import * as logger from 'firebase-functions/logger';
import { trafficStatSchema } from '../../shared';
import { ZodIssue } from 'zod';

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

app.get('/trafficStats', async (req, res) => {
  logger.info('get traffic stats request was made');
  try {
    const snapshot = await db.collection('trafficStats').get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    logger.info('traffic stats were fetched successfully');
    res.status(200).send(data);
  } catch (error) {
    logger.error(`there was an error fetching the traffic stats: ${error}`);
    res.status(500).json({ message: 'could not fetch the traffic stats' });
  }
});

app.post('/trafficStats/add', async (req, res) => {
  logger.info('an add trafficStats request was made');
  const result = trafficStatSchema.safeParse(req.body);
  if (!result.success) {
    const invalidStatsErrorMessage = `recieved an invalid traffic stat: ${result.error.errors.reduce(
      (acc: string, error: ZodIssue) => (acc += `${error.message};`),
      ''
    )}`;
    logger.error(invalidStatsErrorMessage);
    res.status(400).json({ message: invalidStatsErrorMessage });
    return;
  }

  const newTrafficStat = result.data;
  try {
    logger.info(
      `recieved a valid stats object: ${newTrafficStat.toString()}, starting firestore insertion.`
    );
    const docRef = await db.collection('trafficStats').add(newTrafficStat);
    logger.info(`traffic stat was inserted successfully with id: ${docRef.id}`);
    res.status(201).send({
      message: 'traffic stat was inserted successfully',
      id: docRef.id,
    });
  } catch (error) {
    const baseErrorMessage = 'there was an error inserting the traffic stat';
    logger.error(`${baseErrorMessage}: ${error}`);
    res.status(500).json({ message: baseErrorMessage });
  }
});

app.put('/trafficStats/update/:id', async (req, res) => {
  logger.info('an update traffic stats request was made');
  if (!req.params.id) {
    const missingIdMessage = 'request was recieved without an id';
    logger.error(missingIdMessage);
    res.status(400).json({ message: missingIdMessage });
    return;
  }

  const result = trafficStatSchema.safeParse(req.body);
  if (!result.success) {
    const invalidStatsErrorMessage = `recieved an invalid traffic stat: ${result.error.errors.reduce(
      (acc: string, error: ZodIssue) => (acc += `${error.message};`),
      ''
    )}`;
    logger.error(invalidStatsErrorMessage);
    res.status(400).json({ message: invalidStatsErrorMessage });
    return;
  }

  const trafficStat = result.data;
  try {
    logger.info(
      `recieved a valid stats object: ${trafficStat.toString()}, starting firestore update.`
    );
    await db.collection('trafficStats').doc(req.params.id).update(trafficStat);
    const successMessage = 'traffic stat was updated successfully';
    logger.info(successMessage);
    res.status(200).send({
      message: successMessage,
    });
  } catch (error) {
    const baseErrorMessage = 'there was an error updating the traffic stat';
    logger.error(`${baseErrorMessage}: ${error}`);
    res.status(500).json({ message: baseErrorMessage });
  }
});

app.delete('/trafficStats/delete/:id', async (req, res) => {
  logger.info('a traffic stats deletion request was made');
  if (!req.params.id) {
    const missingIdMessage = 'request was recieved without an id';
    logger.error(missingIdMessage);
    res.status(400).json({ message: missingIdMessage });
    return;
  }

  try {
    await db.collection('trafficStats').doc(req.params.id).delete();
    const successMessage = 'traffic stat was deleted successfully';
    logger.info(successMessage);
    res.status(200).send({
      message: successMessage,
    });
  } catch (error) {
    const baseErrorMessage = 'there was an error deleting the traffic stat';
    logger.error(`${baseErrorMessage}: ${error}`);
    res.status(500).json({ message: baseErrorMessage });
  }
});

exports.api = functions.onRequest(app);
