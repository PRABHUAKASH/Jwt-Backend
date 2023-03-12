const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 6,
  },
  occupation: {
    type: String,
  },
  company: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
