import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';


const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name Harus diisi'],
    unique: [true, 'Username sudah digunakan silahkan diganti'],
  },
  email: {
    type: String,
    required: [true, 'Email Harus diisi'],
    unique: [true, 'Username sudah digunakan silahkan diganti'],
    validate: {
      validator: validator.isEmail,
      message: "Harus berformat email seperti foo@mail.com"
    }
  },
  password: {
    type: String,
    required: [true, 'Password Harus diisi'],
    minLength: [6, "password minimal 6 karakter"]
  },
  role: {
    type: String,
    enum: ['user', 'Owner'],
    default: 'user'
  }
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(reqBody){
  return await bcrypt.compare(reqBody, this.password)
}

const User = mongoose.model("User", userSchema)

export default User