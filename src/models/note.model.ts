import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './user.model';
import Joi from 'joi';

class Note extends Model {
  id!: number;
  userId!: number;
  text!: string;

  /**
   * Initializes the Sequelize configuration to map this model to a database table.
   * @param sequelize Sequelize instance.
   */
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelize,
        name: {
          singular: 'Note',
          plural: 'Notes',
        },
      },
    );
  }

  /**
   * Configures all relationships between this model and other models.
   */
  static configureRelationships() {
    this.belongsTo(User);
  }

  /**
   * Validates a note to see if all properties are valid.
   * @param note the note instance to validate.
   * @returns validation result.
   */
  static validate(note: Note): Joi.ValidationResult<Note> {
    const schema = Joi.object({
      text: Joi.string().required().max(255),
    });

    return schema.validate(note);
  }
}

export default Note;
