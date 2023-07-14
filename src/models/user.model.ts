import { DataTypes, Model, Sequelize } from 'sequelize';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import Note from './note.model';
import tokenConfig from '../config/token.json';

class User extends Model {
  id!: number;
  email!: string;
  password!: string;

  /**
   * Generates a JSON web token for the respective user.
   */
  generateAuthToken() {
    const privateKey = process.env.JWT_PRIVATE_KEY || tokenConfig.jwtPrivateKey;
    if (!privateKey) {
      throw new Error('JSON Web Token private key is not configured.');
    }

    return jwt.sign({ id: this.id, email: this.email }, privateKey, {
      expiresIn: 300, // 5 minutes
    });
  }

  /**
   * Initializes the Sequelize configuration to map this model to a database table.
   * @param sequelize Sequelize instance.
   */
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelize,
        name: {
          singular: 'User',
          plural: 'Users',
        },
      },
    );
  }

  /**
   * Configures all relationships between this model and other models.
   */
  static configureRelationships() {
    this.hasMany(Note);
  }

  /**
   * Validates a user to see if all properties are valid.
   * @param note the user instance to validate.
   * @returns validation result.
   */
  static validate(user: User): Joi.ValidationResult<User> {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().max(32),
    });

    return schema.validate(user);
  }
}

export default User;
