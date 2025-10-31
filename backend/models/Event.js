const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: { 
    type: String,
    trim: true 
  },
  date: { 
    type: Date, 
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: 'Invalid date format'
    }
  },
  time: { 
    type: String,
    validate: {
      validator: function(value) {
        return !value || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      },
      message: 'Time must be in HH:MM format'
    }
  },
  location: { 
    type: String,
    trim: true 
  },
  category: { 
    type: String,
    enum: {
      values: ['technology', 'workshop', 'cultural', 'sports', 'career'],
      message: '{VALUE} is not a supported category'
    },
    required: [true, 'Event category is required']
  },
  status: { 
    type: String, 
    enum: ['upcoming', 'completed'], 
    default: 'upcoming'
  },
  image: { 
    type: String,
    validate: {
      validator: function(value) {
        return !value || value.startsWith('data:image/') || value.startsWith('http');
      },
      message: 'Invalid image format'
    }
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  seats: { 
    type: Number, 
    default: 0,
    min: [0, 'Seats cannot be negative']
  },
  attendees: { 
    type: Number, 
    default: 0,
    min: [0, 'Attendees cannot be negative']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Event', EventSchema);
