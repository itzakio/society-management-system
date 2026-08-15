import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type ResidentStatus =
  | "invited"
  | "active"
  | "inactive";

export interface IResident extends Document {
  userId: mongoose.Types.ObjectId;
  societyId: mongoose.Types.ObjectId;

  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  status: ResidentStatus;
}

const residentSchema = new Schema<IResident>(
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

    phone: {
      type: String,
      trim: true,
    },

    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "invited",
        "active",
        "inactive",
      ],
      default: "invited",
    },
  },
  {
    timestamps: true,
  }
);

residentSchema.index(
  {
    userId: 1,
    societyId: 1,
  },
  {
    unique: true,
  }
);

const Resident = mongoose.model<IResident>(
  "Resident",
  residentSchema
);

export default Resident;