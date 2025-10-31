const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  section: { 
    type: String, 
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true
  },
  regNo: { 
    type: String, 
    required: [true, 'Registration number is required'],
    trim: true,
    uppercase: true,
  },
  mobile: { 
    type: String, 
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number`
    }
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    required: [true, 'Event reference is required']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Compound unique index: one regNo per event
RegistrationSchema.index({ regNo: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
