import { Router, Request, Response } from 'express';

import { AuthorizedRequest, authorize } from '../middlewares/authorize';
import validateSchema from '../middlewares/schema-validator';

import NotesController from '../controllers/notes.controller';
import SaveNoteResource from '../resources/notes/save-note-resource';

import Note from '../models/note.model';
import NotesQueryResource from '../resources/notes/notes-query-resource';

const router = Router();
const controller = new NotesController();

router.post(
  '/',
  [authorize(), validateSchema(Note.validate)],
  async (req: Request, res: Response) => {
    const noteResource = await controller.create(
      new SaveNoteResource(req.body.text),
      req as AuthorizedRequest,
    );
    return res.status(200).send(noteResource);
  },
);

router.patch(
  '/:id',
  [authorize(), validateSchema(Note.validate)],
  async (req: Request, res: Response) => {
    const noteResource = await controller.patch(
      +req.params.id,
      new SaveNoteResource(req.body.text),
    );
    const statusCode = 'success' in noteResource ? 400 : 200;
    return res.status(statusCode).send(noteResource);
  },
);

router.delete('/:id', [authorize()], async (req: Request, res: Response) => {
  const noteResource = await controller.delete(+req.params.id);
  const statusCode = 'success' in noteResource ? 404 : 200;
  return res.status(statusCode).send(noteResource);
});

router.get('/', [authorize()], async (req: Request, res: Response) => {
  const page = req.query.page ? +req.query.page : 1;
  const itemsPerPage = req.query.itemsPerPage ? +req.query.itemsPerPage : 1;
  const text = req.query.text ? String(req.query.text) : undefined;

  const queryResource = new NotesQueryResource(page, itemsPerPage, text);
  const queryResultResource = await controller.list(queryResource);
  return res.status(200).send(queryResultResource);
});

router.get('/:id', [authorize()], async (req: Request, res: Response) => {
  const noteResource = await controller.getById(+req.params.id);
  const statusCode = 'success' in noteResource ? 404 : 200;
  return res.status(statusCode).send(noteResource);
});

export default router;
