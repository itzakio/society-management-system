import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IInvitation
  extends Document {
  userId: mongoose.Types.ObjectId;
  societyId: mongoose.Types.ObjectId;

  tokenHash: string;

  expiresAt: Date;

  usedAt?: Date;
}

const invitationSchema =
  new Schema<IInvitation>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      societyId: {
        type: Schema.Types.ObjectId,
        ref: "Society",
        required: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      usedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

const Invitation =
  mongoose.model<IInvitation>(
    "Invitation",
    invitationSchema
  );

export default Invitation;