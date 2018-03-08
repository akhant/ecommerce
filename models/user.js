import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String,
  profile: {
    name: {
      type: String,
      default: ""
    },
    picture: {
      type: String,
      default: ""
    }
  },
  address: String,
  history: [
    {
      date: Date,
      paid: { type: Number, default: 0 }
    }
  ]
});

//hash the password before save
UserSchema.pre("save", function(next){
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


//compare password with password from db
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema)