import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Request,
  Response,
  Tags,
  Path,
  Patch,
  Delete,
  Get,
  Queries,
  Security,
} from 'tsoa';

import SaveNoteResource from '../resources/notes/save-note-resource';
import ErrorResource from '../resources/shared/error-resource';
import NoteResource from '../resources/notes/note-resource';
import NotesQueryResource from '../resources/notes/notes-query-resource';
import QueryResultResource from '../resources/shared/query-result-resource';

import Note from '../models/note.model';
import { AuthorizedRequest } from '../middlewares/authorize';
import { Op } from 'sequelize';

@Route('/api/notes')
@Tags('Notes')
@Security('Bearer')
export default class NotesController extends Controller {
  /**
   * Creates a sticky note using a text provided in the request body.
   * @param resource resource containing the note text.
   * @param request request sent to the API.
   * @returns the created note.
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<ErrorResource>(400, 'Bad Request', {
    success: false,
    messages: ['Invalid data.'],
  })
  @Response<ErrorResource>(401, 'Unauthorized', {
    success: false,
    messages: ['Access denied.'],
  })
  public async create(
    @Body() resource: SaveNoteResource,
    @Request() request: AuthorizedRequest,
  ) {
    const userId = request.userId;
    const note = await Note.create({ userId: userId, text: resource.text });
    return new NoteResource(note.id, note.userId, note.text);
  }

  /**
   * Patches a sticky note by updating its text.
   * @param id note ID.
   * @param resource resource containing the note text.
   * @returns the updated note.
   */
  @Patch('{id}')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResource>(400, 'Bad Request', {
    success: false,
    messages: ['Invalid data.'],
  })
  @Response<ErrorResource>(401, 'Unauthorized', {
    success: false,
    messages: ['Access denied.'],
  })
  public async patch(
    @Path() id: number,
    @Body() resource: SaveNoteResource,
  ): Promise<NoteResource | ErrorResource> {
    const note = await Note.findByPk(id);
    if (!note) {
      return new ErrorResource(['The note was not found.']);
    }

    note.text = resource.text;
    await note.save();

    return new NoteResource(note.id, note.userId, note.text);
  }

  /**
   * Deletes a sticky note by ID.
   * @param id note ID.
   * @returns the deleted note.
   */
  @Delete('{id}')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResource>(404, 'Not Found', {
    success: false,
    messages: ['The note was not found.'],
  })
  @Response<ErrorResource>(401, 'Unauthorized', {
    success: false,
    messages: ['Access denied.'],
  })
  public async delete(
    @Path() id: number,
  ): Promise<NoteResource | ErrorResource> {
    const note = await Note.findByPk(id);
    if (!note) {
      return new ErrorResource(['The note was not found.']);
    }

    await note.destroy();
    return new NoteResource(note.id, note.userId, note.text);
  }

  /**
   * Returns all notes that match query filters.
   * @param query query containing pagination information and a potential text filter.
   * @returns query result.
   */
  @Get()
  @SuccessResponse(200, 'OK')
  @Response<ErrorResource>(401, 'Unauthorized', {
    success: false,
    messages: ['Access denied.'],
  })
  public async list(
    @Queries() query: NotesQueryResource,
  ): Promise<QueryResultResource<NoteResource>> {
    const offset = (query.page - 1) * query.itemsPerPage;
    const limit = query.itemsPerPage;
    const where = !query.text
      ? undefined
      : { text: { [Op.iLike]: `%${query.text}%` } };

    const totalItems = where ? await Note.count({ where }) : await Note.count();
    const notes = await Note.findAll({ offset, limit, where });

    const resources = notes.map(
      note => new NoteResource(note.id, note.userId, note.text),
    );
    return new QueryResultResource<NoteResource>(resources, totalItems);
  }

  /**
   * Retrieves a sticky note by ID.
   * @param id note ID.
   * @returns the retrieved note.
   */
  @Get('{id}')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResource>(404, 'Not Found', {
    success: false,
    messages: ['The note was not found.'],
  })
  @Response<ErrorResource>(401, 'Unauthorized', {
    success: false,
    messages: ['Access denied.'],
  })
  public async getById(
    @Path() id: number,
  ): Promise<NoteResource | ErrorResource> {
    const note = await Note.findByPk(id);
    if (!note) {
      return new ErrorResource(['The note was not found.']);
    }

    return new NoteResource(note.id, note.userId, note.text);
  }
}
